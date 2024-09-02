import Logo from "~/images/logo.svg";

export default function Header() {
  return (
    <header className="container">
      <nav className="flex items-stretch">
        <img className="max-w-56" src={Logo} alt="BarCamp Kathmandu 2024" />
        <div className="justify-end ms-auto">
          <div className="flex justify-center self-end line-height-10">
            <a
              className="rounded-button"
              href="https://forms.gle/x4kEuvwEoJ5qsP3y7"
              target="_blank"
              rel="noreferrer"
            >
              <strong>Submit a Proposal</strong>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
