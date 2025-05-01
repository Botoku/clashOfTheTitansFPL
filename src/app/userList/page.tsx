import Entry from "@/lib/models/EntryModel";
import connectionToDB from "@/lib/mongoose";
import React from "react";
import ExportToExcel from "../components/ExportToExcel";
import UserListTable from "../components/UserListTable";
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
  _id?: string;
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
  return (
    <div className="relative">
      <h1 className="mb-4 text-center text-4xl font-bold">User List Page</h1>
      <ExportToExcel users={users} />
      <div className=" overflow-x-auto shadow-md sm:rounded-lg">
        <UserListTable users={users} />
      </div>
    </div>
  );
};

export default page;
