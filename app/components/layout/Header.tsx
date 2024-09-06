import { useRef, useState } from "react";
import { Form, Link, useSearchParams, useSubmit } from "@remix-run/react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Field,
  Label,
  Input,
} from "@headlessui/react";
import {
  EnvelopeIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Logo from "~/images/logo.svg";

export default function Header({
  isLoggedIn,
  actionIntent,
  actionSuccess,
}: {
  isLoggedIn: boolean;
  actionIntent?: string;
  actionSuccess?: boolean;
}) {
  const submit = useSubmit();
  const [searchParams] = useSearchParams();
  const action = searchParams.get("action");

  const form = useRef<HTMLFormElement>(null);
  const [showLoginPopup, setShowLoginPopup] = useState<boolean>(
    action === "login" ? true : false
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLoginLogout = () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
    } else {
      const formData = new FormData();
      formData.append("intent", "logout");
      submit(formData, { method: "post" });
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <Dialog
        open={showLoginPopup}
        onClose={setShowLoginPopup}
        className="relative z-10"
      >
        <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex  items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-10 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <div className="text-center mb-4">
                    <img
                      src={Logo}
                      alt="BarCamp Kathmandu 2024"
                      className="h-12 m-auto"
                    />
                  </div>
                  <DialogTitle
                    as="h3"
                    className="text-lg mb-4 font-semibold leading-6 text-black"
                  >
                    Email a magic link
                  </DialogTitle>
                  <div className="mt-2">
                    <Form
                      ref={form}
                      method="post"
                      className="flex flex-col gap-2"
                    >
                      {actionIntent === "login" && actionSuccess ? (
                        <div className="rounded-md bg-green-50 p-4">
                          <p className="text-sm font-medium text-green-800">
                            Email has been sent please check your email
                          </p>
                        </div>
                      ) : null}
                      <Field>
                        <Label className="block text-base font-medium mb-4 leading-6 text-black text-left sr-only">
                          Email
                        </Label>
                        <div className="relative mt-2 rounded-md shadow-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <EnvelopeIcon
                              aria-hidden="true"
                              className="h-5 w-5 text-gray-500"
                            />
                          </div>
                          <Input
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            className="block w-full rounded-md border-0 py-2 pl-10 mb-2 mt-2 text-gray-900 ring-1 ring-inset ring-gray-500 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </Field>
                      <button
                        disabled={actionIntent === "login" && actionSuccess}
                        name="intent"
                        value="login"
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md bg-orange-500 px-7 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 disabled:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
                      >
                        Send Link
                      </button>
                    </Form>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <Link className="flex w-48 h-16 sm:h-20 py-2 items-start" to="/">
            <img src={Logo} alt="BarCamp Kathmandu 2024" />
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

          <div className="hidden lg:flex space-x-8 items-center">
            <Link
              className="text-base font-semibold text-black hover:underline"
              to="/"
            >
              Home
            </Link>
            <Link
              className="text-base font-semibold text-black hover:underline"
              to="/about"
            >
              About
            </Link>
            <Link
              className="text-base font-semibold text-black hover:underline"
              to="/faq"
            >
              FAQ
            </Link>
          </div>

          <div className="hidden lg:flex gap-2 items-center">
            <button
              onClick={handleLoginLogout}
              className="bg-orange-500 rounded-full px-6 py-2 text-base font-medium text-white hover:bg-orange-700"
            >
              {isLoggedIn ? "Logout" : "Login"}
            </button>
            <Link
              className="rounded-full border border-black px-5 py-2 text-base font-medium text-black hover:bg-orange-700 hover:text-white"
              to="/request-proposal"
            >
              Submit a Proposal
            </Link>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden flex flex-col items-center bg-white py-4">
            <Link
              className="block px-4 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
              to="/"
              onClick={toggleMobileMenu}
            >
              Home
            </Link>
            <Link
              className="block px-4 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
              to="/about"
              onClick={toggleMobileMenu}
            >
              About
            </Link>
            <Link
              className="block px-4 py-2 text-base font-medium text-gray-900 hover:bg-gray-100"
              to="/faq"
              onClick={toggleMobileMenu}
            >
              FAQ
            </Link>
            <button
              onClick={handleLoginLogout}
              className="mt-4 bg-orange-500 rounded-full px-6 py-2 text-base font-medium text-white hover:bg-orange-700"
            >
              {isLoggedIn ? "Logout" : "Login"}
            </button>
            <Link
              className="mt-2 rounded-full border border-black px-5 py-2 text-base font-medium text-black hover:bg-orange-700 hover:text-white"
              to="/request-proposal"
              onClick={toggleMobileMenu}
            >
              Submit a Proposal
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
