import { Form, Link } from "@remix-run/react";

export default function HeaderMenu({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <>
      <a
        className="rounded-full border border-black px-5 py-2 text-base font-medium text-black hover:bg-orange-700 hover:text-white"
        href="/ktm/2024"
      >
        2024
      </a>
      {isLoggedIn ? (
        <Form action="/login" method="post">
          <input type="hidden" name="intent" value="logout" />
          <button className="bg-sky-500 rounded-full px-6 py-2 text-base font-medium text-white hover:bg-sky-400">
            {isLoggedIn ? "Logout" : "Login"}
          </button>
        </Form>
      ) : (
        <Link
          className="bg-sky-500 rounded-full px-6 py-2 text-base font-medium text-white hover:bg-sky-400"
          to="/login"
        >
          Login
        </Link>
      )}

      <Link
        className="bg-orange-500 rounded-full px-5 py-2 text-base font-medium  hover:bg-orange-700 text-white"
        to="/submit-proposal"
      >
        Submit a Proposal
      </Link>
    </>
  );
}
