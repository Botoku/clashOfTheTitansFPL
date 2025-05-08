"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import Loading from "./LoadingComponent";

const RegistrationForm = () => {
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setemail] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [twitter, settwitter] = useState("");
  const [instagram, setinstagram] = useState("");
  const [fplTeam, setfplTeam] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formValid, setFormValid] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const options = ["general", "h2h", "legends", "worldClass"];

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  const handleFormSubmit = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/s3-upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      const fileName = data.fileName;

      if (data) {
        try {
          const res = await fetch("/api/userEntries", {
            method: "POST",
            body: JSON.stringify({
              firstName,
              lastName,
              email,
              phoneNumber: new Number(phoneNumber),
              twitter,
              instagram,
              fplTeam,
              category: selectedOptions.join(", "),
              imageUrl: `https://clash-of-the-titans-fpl.s3.us-east-1.amazonaws.com/${fileName}`,
            }),
          });
          if (res.status === 200) {
            setUploading(false);
            fetch("/api/emails", {
              method: "POST",
              body: JSON.stringify({
                firstName,
                lastName,
                email,
                phoneNumber,
                twitter,
                instagram,
                fplTeam,
                category: selectedOptions.join(", "),
                imageUrl: `https://clash-of-the-titans-fpl.s3.us-east-1.amazonaws.com/${fileName}`,
              }),
            });
            setResponseMessage("Submission SuccessFul");
            setfirstName("");
            setlastName("");
            setemail("");
            setphoneNumber("");
            settwitter("");
            setinstagram("");
            setfplTeam("");
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      setUploading(false);
      console.log(error);
    }
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    // Validate file size
    if (selectedFile && selectedFile.size > MAX_FILE_SIZE) {
      setError("File size exceeds the 5MB limit.");
      setFile(null);
    } else {
      setError("");
      setFile(selectedFile || null);
    }
  };
  const handleToggle = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };
  const validateField = (name: string, value: string) => {
    let message = "";

    switch (name) {
      case "firstName":
        if (!value.trim()) message = "First name is required";
        break;
      case "lastName":
        if (!value.trim()) message = "Last name is required";
        break;
      case "email":
        if (!value.trim() || !/\S+@\S+\.\S+/.test(value))
          message = "Valid email is required";
        break;
      case "phoneNumber":
        if (!value.trim() || !/^\d+$/.test(value))
          message = "Valid phone number is required";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
  };
  const transformOptions = (option: string) => {
    if (option === "general") return "General - N4,000";
    if (option === "h2h") return "H2H - N2,500";
    if (option === "legends") return "Legends - N20,000";
    if (option === "worldClass") return "WorldClass - N10,000";
  };
  useEffect(() => {
    const requiredFieldsFilled =
      firstName.trim() &&
      lastName.trim() &&
      email.trim() &&
      phoneNumber.trim() &&
      file;

    const noErrors = Object.values(errors).every((msg) => !msg);

    setFormValid(!!requiredFieldsFilled && noErrors);
  }, [firstName, lastName, email, phoneNumber, file, errors]);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleFormSubmit();
        }}
        className="w-max bg-gray-400 mx-auto px-2 lg:px-6 py-5"
      >
        <div className="flex gap-3">
          <div className="relative z-0 w-full mb-5 group">
            <input
              value={firstName}
              onChange={(e) => setfirstName(e.target.value)}
              onBlur={(e) => validateField("firstName", e.target.value)}
              type="text"
              name="firstName"
              id="firstname"
              className="block py-2.5 px-0 w-full text-sm  bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-[#3B1B5E] peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="firstname"
              className="peer-focus:font-medium absolute text-sm  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#3B1B5E] peer-focus:dark:text-[#3b1b5eda] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              First Name
            </label>
            {errors.firstName && (
              <span className="text-red-500 text-sm">{errors.firstName}</span>
            )}
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              value={lastName}
              onChange={(e) => setlastName(e.target.value)}
              onBlur={(e) => validateField("lastName", e.target.value)}
              type="text"
              name="lastName"
              id="lastname"
              className="block py-2.5 px-0 w-full text-sm  bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-[#3B1B5E] peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="lastname"
              className="peer-focus:font-medium absolute text-sm  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#3B1B5E] peer-focus:dark:text-[#3b1b5eda] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Last Name
            </label>
            {errors.lastName && (
              <span className="text-red-500 text-sm">{errors.lastName}</span>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <div className="relative z-0 w-full mb-5 group">
            <input
              value={email}
              onChange={(e) => setemail(e.target.value)}
              onBlur={(e) => validateField("email", e.target.value)}
              type="text"
              name="email"
              id="lastname"
              className="block py-2.5 px-0 w-full text-sm  bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-[#3B1B5E] peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="lastname"
              className="peer-focus:font-medium absolute text-sm  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#3B1B5E] peer-focus:dark:text-[#3b1b5eda] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email
            </label>
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email}</span>
            )}
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              value={phoneNumber}
              onChange={(e) => setphoneNumber(e.target.value)}
              onBlur={(e) => validateField("phoneNumber", e.target.value)}
              type="text"
              name="phoneNumber"
              id="phoneNumber"
              className="block py-2.5 px-0 w-full text-sm  bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-[#3B1B5E] peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="phoneNumber"
              className="peer-focus:font-medium absolute text-sm  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#3B1B5E] peer-focus:dark:text-[#3b1b5eda] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Phone Number
            </label>
            {errors.phoneNumber && (
              <span className="text-red-500 text-sm">{errors.phoneNumber}</span>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <div className="relative z-0 w-full mb-5 group">
            <input
              value={twitter}
              onChange={(e) => settwitter(e.target.value)}
              onBlur={(e) => validateField("twitter", e.target.value)}
              type="text"
              name="twitter"
              id="twitter"
              className="block py-2.5 px-0 w-full text-sm  bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-[#3B1B5E] peer"
              placeholder=" "
            />
            <label
              htmlFor="twitter"
              className="peer-focus:font-medium absolute text-sm  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#3B1B5E] peer-focus:dark:text-[#3b1b5eda] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Twitter
            </label>
            {errors.twitter && (
              <span className="text-red-500 text-sm">{errors.twitter}</span>
            )}
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              value={instagram}
              onChange={(e) => setinstagram(e.target.value)}
              onBlur={(e) => validateField("instagram", e.target.value)}
              type="text"
              name="instagram"
              id="instagram"
              className="block py-2.5 px-0 w-full text-sm  bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-[#3B1B5E] peer"
              placeholder=" "
            />
            <label
              htmlFor="instagram"
              className="peer-focus:font-medium absolute text-sm  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#3B1B5E] peer-focus:dark:text-[#3b1b5eda] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Instagram
            </label>
            {errors.instagram && (
              <span className="text-red-500 text-sm">{errors.instagram}</span>
            )}
          </div>
        </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              value={fplTeam}
              onChange={(e) => setfplTeam(e.target.value)}
              onBlur={(e) => validateField("fplTeam", e.target.value)}
              type="text"
              name="fplTeam"
              id="fplTeam"
              className="block py-2.5 px-0 w-full text-sm  bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-[#3B1B5E] peer"
              placeholder=" "
            />
            <label
              htmlFor="fplTeam"
              className="peer-focus:font-medium absolute text-sm  duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#3B1B5E] peer-focus:dark:text-[#3b1b5eda] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              FPL Team
            </label>
            {errors.fplTeam && (
              <span className="text-red-500 text-sm">{errors.fplTeam}</span>
            )}
          </div>
        <div className="flex gap-3">
          <div >
            <p className="text-sm">
              Select the League class you wish to pay for:
            </p>
            <ul className="space-y-2">
              {options.map((option) => (
                <li key={option} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={option}
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleToggle(option)}
                    className="h-4 w-4"
                  />
                  <label
                    htmlFor={option}
                    className="cursor-pointer text-sm italic"
                  >
                    {transformOptions(option)}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
     

        <div className="my-3">
          <p className="italic text-sm">
            Upload image/screenshot of your payment receipt to continue
          </p>
          <input
            className=" cursor-pointer"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />

          <p className="mb-3">Max 5MB</p>
          {error && <>{error}</>}
        </div>
        {uploading && (
          <div className="w-full flex justify-center items-center">
            <Loading />
          </div>
        )}

        {responseMessage ? (
          <p className="font-bold w-max mx-auto">{responseMessage}</p>
        ) : (
          <button
            className={`bg-[#3B1B5E] text-white px-3 py-2 w-20 mx-auto ${
              !formValid || uploading
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:font-bold"
            }`}
            type="submit"
            disabled={!formValid || uploading}
          >
            Submit
          </button>
        )}
      </form>
    </>
  );
};

export default RegistrationForm;
