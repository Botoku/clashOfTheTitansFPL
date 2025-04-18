import Image from "next/image";
import RegistrationForm from "./components/RegistrationForm";
import RegistrationWrapper from "./components/RegistrationWrapper";

export default function Home() {
  return (
    <div className="bg-gray-200 text-black h-[100vh]">
      <div className="flex mx-auto w-max mb-5">
        <img className="w-10 h-10" src="/Clash of The Titans Logo.png" alt="" />
        <h1 className="font-bold">Clash of The Titans 2024/2025</h1>
      </div>
      <RegistrationWrapper />
    </div>
  );
}

// red #DC0F08
// purple #3B1B5E
