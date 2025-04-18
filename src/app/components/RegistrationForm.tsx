"use client";
import React, { ChangeEvent, Dispatch, SetStateAction, useState } from "react";

type Props = {};
const RegistrationForm = ({}: Props) => {
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setemail] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [twitter, settwitter] = useState("");
  const [instagram, setinstagram] = useState("");
  const [fplTeam, setfplTeam] = useState("");
  const [category, setcategory] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
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
              phoneNumber,
              twitter,
              instagram,
              fplTeam,
              category: "category",
              imageUrl: `https://clash-of-the-titans-fpl.s3.us-east-1.amazonaws.com/${fileName}`,
            }),
          });
        } catch (error) {
          console.log(error);
        }
      }
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
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
      <form action={handleFormSubmit}>
        <div>
          <label htmlFor="firstname">firstname</label>
          <input
            value={firstName}
            onChange={(e) => setfirstName(e.target.value)}
            type="text"
            name="firstName"
            id="firstname"
          />
        </div>
        <div>
          <label htmlFor="lastname">lastname</label>
          <input
            value={lastName}
            onChange={(e) => setlastName(e.target.value)}
            type="text"
            name="lastName"
            id="lastname"
          />
        </div>
        <div>
          <label htmlFor="email">email</label>
          <input
            value={email}
            onChange={(e) => setemail(e.target.value)}
            type="text"
            name="email"
            id="email"
          />
        </div>
        <div>
          <label htmlFor="phoneNumber">phoneNumber</label>
          <input
            value={phoneNumber}
            onChange={(e) => setphoneNumber(e.target.value)}
            type="text"
            name="phoneNumber"
            id="phoneNumber"
          />
        </div>
        <div>
          <label htmlFor="twitter">twitter</label>
          <input
            value={twitter}
            onChange={(e) => settwitter(e.target.value)}
            type="text"
            name="twitter"
            id="twitter"
          />
        </div>
        <div>
          <label htmlFor="instagram">instagram</label>
          <input
            value={instagram}
            onChange={(e) => setinstagram(e.target.value)}
            type="text"
            name="instagram"
            id="instagram"
          />
        </div>
        <div>
          <label htmlFor="fplTeam">fplTeam</label>
          <input
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

        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default RegistrationForm;
