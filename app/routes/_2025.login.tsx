import { ActionFunction, data, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { createClient } from "~/utils/supabase.server";
import { Field, Label, Input } from "@headlessui/react";
import { useCallback } from "react";
import { EnvelopeIcon } from "@heroicons/react/20/solid";

export const action: ActionFunction = async ({ request }) => {
  const { supabaseClient, headers } = createClient(request);

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "login") {
    const email = formData.get("email") as string;

    const { error } = await supabaseClient.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: process.env.SUPABASE_CALLBACK_URL,
      },
    });

    if (error) {
      return data({ intent, success: false }, { headers });
    }

    return data({ intent, success: true }, { headers });
  }

  if (intent === "logout") {
    // sign out
    await supabaseClient.auth.signOut();
    return redirect("/", {
      headers,
    });
  }

  return data({ intent, success: false }, { headers });
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();

  const getEmailButtonLinkText = useCallback(() => {
    if (actionData?.data?.intent === "login" && actionData?.data?.success)
      return "Link Sent";

    if (navigation.state === "submitting") return "Sending Link...";

    return "Send Link";
  }, [actionData?.data, navigation.state]);

  return (
    <div className="sm:min-w-full inset-0 z-10 w-screen overflow-y-auto">
      <div className="flex  items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="transform  rounded-lg bg-white px-4 pb-4 pt-10 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-sm sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95">
          <div>
            <div className="mt-3 text-center sm:mt-5">
              <h2 className="text-lg mb-4 font-semibold leading-6 text-black">
                Please enter your email to Login
              </h2>
              <div className="mt-2">
                <Form method="post" className="flex flex-col gap-2">
                  {actionData?.data?.intent === "login" &&
                  actionData?.data?.success ? (
                    <div className="rounded-md bg-green-50 p-4">
                      <p className="text-sm font-medium text-green-800">
                        We have sent you a login link in your email.
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
                    disabled={
                      (actionData?.data?.intent === "login" &&
                        actionData?.data?.success) ||
                      navigation.state === "submitting"
                    }
                    name="intent"
                    value="login"
                    type="submit"
                    className="inline-flex w-full justify-center rounded-md bg-orange-500 px-7 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 disabled:bg-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
                  >
                    {getEmailButtonLinkText()}
                  </button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
