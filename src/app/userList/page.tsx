import Entry from "@/lib/models/EntryModel";
import connectionToDB from "@/lib/mongoose";
import React from "react";
import ExportToExcel from "../components/ExportToExcel";
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
  
  const getUsers =async ():  Promise<Users[]> => {
    try {
      await connectionToDB();
      const userData = await Entry.find({});
      const users = JSON.parse(JSON.stringify(userData))
      return users as Users[]
      
    } catch (error) {
      console.log(error);
      return []
    }
  };
  const users: Users[] = await getUsers();
  console.log(users)
  return (
    <div>
      <h1 className="text-lg mb-4">User List Page</h1>
      <ExportToExcel users={(users)} />
      <div>
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
      </div>
    </div>
  );
};

export default page;
