"use client";
import React from "react";
import { Users } from "../userList/page";
import { onGetExport } from "@/lib/excelConvert";

type Props = {
  users: Users[];
};

const ExportToExcel = (props: Props) => {
  return (
    <div className="mb-5">
      <button
        className="bg-[#3B1B5E] text-white px-3 py-2 cursor-pointer mx-auto"
        onClick={() => onGetExport(props.users, "ClashOfTitans", "userList")}
      >
        Export to Excel
      </button>
    </div>
  );
};

export default ExportToExcel;
