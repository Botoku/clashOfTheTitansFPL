"use client";
import { getCategory } from "@/lib/excelConvert";
import React, { useState } from "react";
import { Users } from "../userList/page";
import { useRouter } from "next/navigation";

const UserListTable = ({ users }: { users: Users[] }) => {
  const [selectedEditUser, setSelectedEditUser] = useState<Users | null>(null);
  const [formData, setFormData] = useState<Partial<Users>>({});
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const router = useRouter();
  const handleToggle = (option: string) => {
    let updatedOptions = [];
    if (selectedOptions.includes(option)) {
      updatedOptions = selectedOptions.filter((item) => item !== option);
    } else {
      updatedOptions = [...selectedOptions, option];
    }
    setSelectedOptions(updatedOptions);
    setFormData((prev) => ({
      ...prev,
      category: updatedOptions.join(","),
    }));
  };
  const options = ["general", "h2h", "legends", "worldClass"];

  const handleEditClick = (user: Users) => {
    console.log(user);
    setSelectedEditUser(user);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated user data:", formData);
    // TODO: send updated data to server via API
    const finalData = {
      ...formData,
      _id: selectedEditUser && selectedEditUser._id,
    };
    const res = await fetch("/api/userEntries", {
      method: "PATCH",
      body: JSON.stringify(finalData),
    });
    if (res.status === 200) {
      setFormData({})
      router.refresh();
    }
    setSelectedEditUser(null);
  };

  return (
    <div className="h-[80vh]">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
            <th className="px-6 py-3">firstName</th>
            <th className="px-6 py-3">lastName</th>
            <th className="px-6 py-3">email</th>
            <th className="px-6 py-3">teamName</th>
            <th className="px-6 py-3">general</th>
            <th className="px-6 py-3">h2h</th>
            <th className="px-6 py-3">legends</th>
            <th className="px-6 py-3">worldclass</th>
            <th className="px-6 py-3">phoneNumber</th>
            <th className="px-6 py-3">Instagram</th>
            <th className="px-6 py-3">Twitter</th>
            <th className="px-6 py-3">linkToReceipt</th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user, i) => (
            <tr key={i} className="mb-4 border-b">
              <td className="px-6 py-4">{user.firstName}</td>
              <td className="px-6 py-4">{user.lastName}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">{user.fplTeam}</td>
              <td className="px-6 py-4">
                {getCategory(user.category, "general")}
              </td>
              <td className="px-6 py-4">{getCategory(user.category, "h2h")}</td>
              <td className="px-6 py-4">
                {getCategory(user.category, "legends")}
              </td>
              <td className="px-6 py-4">
                {getCategory(user.category, "worldClass")}
              </td>
              <td className="px-6 py-4">{user.phoneNumber}</td>
              <td className="px-6 py-4">{user.instagram}</td>
              <td className="px-6 py-4">{user.twitter}</td>
              <td className="px-6 py-4">
                <a className="hover:text-blue-300" href={user.imageUrl}>
                  {user.imageUrl}
                </a>
              </td>
              <td className="px-6 py-4">
                <p
                  className="text-blue-300 underline cursor-pointer hover:text-blue-500"
                  onClick={() => handleEditClick(user)}
                >
                  Edit
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedEditUser && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-[#000000c9]">
          <div>
            <p className="text-xl">
              Editing:{" "}
              <span className="italic">
                {selectedEditUser.firstName} {selectedEditUser.lastName}
              </span>
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-2">
                <label className="text-sm block mb-1">First Name</label>
                <input
                  name="firstName"
                  value={formData.firstName || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-2">
                <label className="text-sm block mb-1">Last Name</label>
                <input
                  name="lastName"
                  value={formData.lastName || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-2">
                <label className="text-sm block mb-1">Email</label>
                <input
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-2">
                <label className="text-sm block mb-1">Phone Number</label>
                <input
                  name="phoneNumber"
                  value={formData.phoneNumber || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-2">
                <label className="text-sm block mb-1">Team Name</label>
                <input
                  name="fplTeam"
                  value={formData.fplTeam || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-2">
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
                <div className="mb-2">
                  <label className="text-sm block mb-1">Instagram</label>
                  <input
                    name="instagram"
                    value={formData.instagram || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1">Twitter</label>
                  <input
                    name="twitter"
                    value={formData.twitter || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-800 text-white rounded cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedEditUser(null)}
                  className="px-4 py-2 bg-gray-400 hover:bg-gray-700 text-white rounded cursor-pointer"
                >
                  Cancel
                </button>
                <p
                  className="px-4 py-2 bg-red-600 hover:bg-red-800 text-white rounded cursor-pointer"
                  onClick={() => setSelectedEditUser(null)}
                >
                  Close
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserListTable;
