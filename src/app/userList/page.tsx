import Entry from "@/lib/models/EntryModel";
import connectionToDB from "@/lib/mongoose";
import React from "react";
import ExportToExcel from "../components/ExportToExcel";
import { getCategory } from "@/lib/excelConvert";
export const dynamic = "force-dynamic";
export type Users = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: number;
  twitter: string;
  instagram: string;
  fplTeam: string;
  category: string;
  imageUrl: string;
};

const page = async () => {
  const getUsers = async (): Promise<Users[]> => {
    try {
      await connectionToDB();
      const userData = await Entry.find({});
      const users = JSON.parse(JSON.stringify(userData));
      return users as Users[];
    } catch (error) {
      console.log(error);
      return [];
    }
  };
  const users: Users[] = await getUsers();
  console.log(users);
  return (
    <div>
      <h1 className="text-lg mb-4">User List Page</h1>
      <ExportToExcel users={users} />
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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
            </tr>
          </thead>
          <tbody>
            {users?.map((user, i) => (
              <tr key={i} className="mb-4 border-b">
                <td className="px-6 py-4">{user.firstName}</td>
                <td className="px-6 py-4">{user.lastName}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.fplTeam}</td>
                <td className="px-6 py-4">{getCategory(user.category, "general")}</td>
                <td className="px-6 py-4">{getCategory(user.category, "h2h")}</td>
                <td className="px-6 py-4">{getCategory(user.category, "legends")}</td>
                <td className="px-6 py-4">{getCategory(user.category, "worldClass")}</td>
                <td className="px-6 py-4">{user.phoneNumber}</td>
                <td className="px-6 py-4">{user.instagram}</td>
                <td className="px-6 py-4">{user.twitter}</td>
                <td className="px-6 py-4">
                  <a className="hover:text-blue-300" href={user.imageUrl}>{user.imageUrl}</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* <div>
        {users?.map((user, i) => (
          <div key={i} className="mb-4 border-b">
            <p>Firstname:{user.firstName}</p>
            <p>Lastname: {user.lastName}</p>
            <p>FplTeam: {user.fplTeam}</p>
            <p>{user.category}</p>
            <p>{user.phoneNumber}</p>
            <p>TW: {user.twitter}</p>
            <p>Insta: {user.instagram}</p>
            <img className="w-32 h-32" src={user.imageUrl} alt="" />
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default page;
