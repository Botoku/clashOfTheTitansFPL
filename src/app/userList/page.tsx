import React from "react";

type Users = {
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
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/userEntries`);
  const data = await res.json();
  const users: Users[] = data.users;
  return (
    <div>
      <h1 className="text-lg mb-4">User List Page</h1>
      <div>
        {users?.map((user, i) => (
          <div key={i} className="mb-4 border-b border-amber-600">
            <p>Firstname:{user.firstName}</p>
            <p>Lastname: {user.lastName}</p>
            <p>FplTeam: {user.fplTeam}</p>
            <img className="w-32 h-32" src={user.imageUrl} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
