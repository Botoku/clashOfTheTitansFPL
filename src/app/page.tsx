
import RegistrationForm from "./components/RegistrationForm";

export default function Home() {
  return (
    <div className=" py-6">
      <div className="flex mx-auto w-max mb-5 items-center">
        <h1 className="font-bold  text-lime">Clash of The Titans </h1>
        {/* <img className="w-10 h-10" src="/Clash of The Titans Logo.png" alt="Clash of the titans logo" /> */}
      </div>
      <RegistrationForm />
    </div>
  );
}

// red #DC0F08
// purple #3B1B5E
