import { Link } from "@remix-run/react";

export default function HeaderMenu() {
  return (
    <>
      <a
        className="rounded-full border border-black px-5 py-2 text-base font-medium text-black hover:bg-orange-700 hover:text-white"
        href="/ktm/2024"
      >
        2024
      </a>
      <Link
        className="bg-orange-500 rounded-full px-5 py-2 text-base font-medium  hover:bg-orange-700 text-white"
        to="https://wwktm-2023.notion.site/Schedule-Barcamp-2025-1f034d24f7928055aba0e870faa7b953"
      >
        Event Schedule
      </Link>
    </>
  );
}
