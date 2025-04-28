import { useState } from "react";
import { Link } from "@remix-run/react";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "~/images/barcamp.svg";
import HeaderMenu from "../common/HeaderMenu";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <Link className="flex w-48 h-16 sm:h-20 py-2 items-start" to="/">
            <img src={Logo} alt="BarCamp Kathmandu 2025" />
          </Link>

          <button
            onClick={toggleMobileMenu}
            className="lg:hidden flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>

          <div className="hidden lg:flex gap-2 items-center">
            <HeaderMenu />
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden flex flex-col items-center bg-white py-4">
            <HeaderMenu />
          </div>
        )}
      </header>
    </>
  );
}
