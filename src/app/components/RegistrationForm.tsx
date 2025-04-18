"use client";
import React, { ChangeEvent, useState } from "react";

const RegistrationForm = () => {
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setemail] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [twitter, settwitter] = useState("");
  const [instagram, setinstagram] = useState("");
  const [fplTeam, setfplTeam] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  const handleFormSubmit = async () => {
    if (!file) return;

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
              phoneNumber,
              twitter,
              instagram,
              fplTeam,
              category: "category",
              imageUrl: `https://clash-of-the-titans-fpl.s3.us-east-1.amazonaws.com/${fileName}`,
            }),
          });
          if (res.status === 200) {
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

  return (
    <>
      <form
        action={handleFormSubmit}
        className="w-max bg-gray-400 mx-auto px-8 py-5"
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
          <label htmlFor="">Category</label>
          <select
            defaultValue={["general"]}
            multiple={true}
            name="category"
            id=""
          >
            <option value="">
              Please select what league you are paying for
            </option>
            <option value="general">general 4000</option>
            <option value="h2h">h2h 2500</option>
            <option value="legends">legends 20,000</option>
            <option value="worldClass">world Class 10,000</option>
          </select>
        </div>

        <div>
          <input type="file" accept="image/*" onChange={handleFileChange} />

          <p>Max 5MB</p>
          {error && <>{error}</>}
        </div>

        {responseMessage ? (
          responseMessage
        ) : (
          <button
            className="bg-[#3B1B5E] text-white px-3 py-2 cursor-pointer"
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
