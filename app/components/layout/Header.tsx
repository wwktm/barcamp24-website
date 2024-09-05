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
import { EnvelopeIcon } from "@heroicons/react/20/solid";
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
  const handleLoginLogout = () => {
    if (!isLoggedIn) {
      setShowLoginPopup(true);
    } else {
      const formData = new FormData();
      formData.append("intent", "logout");
      submit(formData, { method: "post" });
    }
  };
  return (
    <>
      <Dialog
        open={showLoginPopup}
        onClose={setShowLoginPopup}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900"
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
                        <Label className="block text-sm font-medium leading-6 text-gray-900 text-left sr-only">
                          Email
                        </Label>
                        <div className="relative mt-2 rounded-md shadow-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <EnvelopeIcon
                              aria-hidden="true"
                              className="h-5 w-5 text-gray-400"
                            />
                          </div>
                          <Input
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          />
                        </div>
                      </Field>
                      <button
                        disabled={actionIntent === "login" && actionSuccess}
                        name="intent"
                        value="login"
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md bg-orange-500 px-7 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 disabled:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
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
      <header className="">
        <div className="container">
          <nav className="flex w-full items-center justify-between">
            <Link className="flex w-auto h-20 py-2" to="/">
              <img src={Logo} alt="BarCamp Kathmandu 2024" />
            </Link>
            <div className="menu relative mx-auto hidden grow items-center justify-center space-x-8 px-4 lg:flex">
              <Link
                className="text-base font-semibold text-gray-900 transition hover:underline"
                to="/"
              >
                Home
              </Link>
              <Link
                className="text-base font-semibold text-gray-900 transition hover:underline"
                to="/"
              >
                About
              </Link>
              <Link
                className="text-base font-semibold text-gray-900 transition hover:underline"
                to="/"
              >
                Faq
              </Link>
            </div>
            <div className="ms-auto">
              <div className="flex gap-2 justify-center self-end line-height-10">
                <button
                  onClick={handleLoginLogout}
                  className="bg-orange-500 inline-flex items-center justify-center rounded-full border border-transparent px-6 py-2 text-base font-medium text-white transition hover:bg-orange-700 focus-visible:outline"
                >
                  {isLoggedIn ? "Logout" : "Login"}
                </button>
                <Link
                  className="inline-flex items-center justify-center rounded-full border border-stone-900 bg-transparent px-5 py-3 text-base font-medium text-stone-700 transition hover:bg-orange-700 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  to="/request-proposal"
                >
                  <strong>Submit a Proposal</strong>
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
