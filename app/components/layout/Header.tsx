import { Link } from "@remix-run/react";
import Logo from "~/images/logo.svg";

export default function Header() {
  return (
    <header className="container">
      <nav className="flex items-stretch">
        <Link className="flex w-auto h-20" to="/">
          <img src={Logo} alt="BarCamp Kathmandu 2024" />
        </Link>
        <div className="justify-end ms-auto">
          <div className="flex justify-center self-end line-height-10">
            <Link className="rounded-button" to="/request-proposal">
              <strong>Submit a Proposal</strong>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
