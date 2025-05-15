import { Link } from "@remix-run/react";

export default function HeaderMenu({
  isLoggedIn,
  handleLoginLogout,
}: {
  isLoggedIn: boolean;
  handleLoginLogout: () => void;
}) {
  return (
    <>
      <a
        className="rounded-full border border-black px-5 py-2 text-base font-medium text-black hover:bg-orange-700 hover:text-white"
        href="/ktm/2024"
      >
        2024
      </a>
      <button
        onClick={handleLoginLogout}
        className="bg-sky-500 rounded-full px-6 py-2 text-base font-medium text-white hover:bg-sky-400"
      >
        {isLoggedIn ? "Logout" : "Login"}
      </button>
      <Link
        className="bg-orange-500 rounded-full px-5 py-2 text-base font-medium  hover:bg-orange-700 text-white"
        to="/submit-proposal"
      >
        Submit a Proposal
      </Link>
    </>
  );
}
