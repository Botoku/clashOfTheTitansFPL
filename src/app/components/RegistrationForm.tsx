"use client";
import React, { ChangeEvent, useState } from "react";
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
            fetch('/api/emails', {
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
              })
            })
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

  return (
    <>
      <form
      onSubmit={e => {
        e.preventDefault()
        handleFormSubmit()
      }}
        className="w-max bg-gray-400 mx-auto px-2 lg:px-6 py-5"
      >
        <div className="flex flex-col mb-3">
          <label htmlFor="firstname">First Name</label>
          <input
            className="border-b border-[#3B1B5E] inline-block"
            value={firstName}
            onChange={(e) => setfirstName(e.target.value)}
            type="text"
            name="firstName"
            id="firstname"
          />
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="lastname">Last Name</label>
          <input
            className="border-b border-[#3B1B5E]"
            value={lastName}
            onChange={(e) => setlastName(e.target.value)}
            type="text"
            name="lastName"
            id="lastname"
          />
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="email">Email</label>
          <input
            className="border-b border-[#3B1B5E]"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            type="text"
            name="email"
            id="email"
          />
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            className="border-b border-[#3B1B5E]"
            value={phoneNumber}
            onChange={(e) => setphoneNumber(e.target.value)}
            type="text"
            name="phoneNumber"
            id="phoneNumber"
          />
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="twitter">Twitter</label>
          <input
            className="border-b border-[#3B1B5E]"
            value={twitter}
            onChange={(e) => settwitter(e.target.value)}
            type="text"
            name="twitter"
            id="twitter"
          />
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="instagram">Instagram</label>
          <input
            className="border-b border-[#3B1B5E]"
            value={instagram}
            onChange={(e) => setinstagram(e.target.value)}
            type="text"
            name="instagram"
            id="instagram"
          />
        </div>
        <div className="flex flex-col mb-3">
          <label htmlFor="fplTeam">FplTeam</label>
          <input
            className="border-b border-[#3B1B5E]"
            value={fplTeam}
            onChange={(e) => setfplTeam(e.target.value)}
            type="text"
            name="fplTeam"
            id="fplTeam"
          />
        </div>

        <div>
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
                <label htmlFor={option} className="cursor-pointer">
                  {option}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="my-3">
          <p className="italic text-sm">Upload image/screenshot of your payment receipt to continue</p>
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
          <p className="font-bold w-max mx-auto">

            {responseMessage}
          </p>
        ) : (
          <button
            className="bg-[#3B1B5E] text-white px-3 py-2 cursor-pointer mx-auto"
            type="submit"
          >
            Submit
          </button>
        )}
      </form>
    </>
  );
};

export default RegistrationForm;
