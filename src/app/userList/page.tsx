import Entry from "@/lib/models/EntryModel";
import React from "react";

type Props = {};
type Users = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: number;
  twitter: string;
  instagram: string;
  fplTeam: string;
  category: string;
};
const fetchUsers = async () => {
  let users: Users[] = [];
  users = await Entry.find({});
  return users;
};
const page = async (props: Props) => {
  const users = await fetchUsers();
  console.log(users);
  return (
    <div>
      <h1 className="text-lg mb-4">User List Page</h1>
      <div>
        {users?.map((user) => (
          <div className="mb-4 border-b border-amber-600">
            <p>Firstname:{user.firstName}</p>
            <p>Lastname: {user.lastName}</p>
            <p>FplTeam: {user.fplTeam}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
