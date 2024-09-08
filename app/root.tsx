import {
  ActionFunction,
  json,
  LinksFunction,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useActionData,
  useLoaderData,
} from "@remix-run/react";
import stylesheet from "~/css/style.css?url";
import Header from "~/components/layout/Header";
import { createSupabaseServerClient } from "~/utils/supabase.server";
import Footer from "~/components/layout/Footer";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  {
    rel: "icon",
    type: "image/png",
    href: "/favicon.png",
  },
];
export const loader: LoaderFunction = async ({ request }) => {
  const { supabaseClient } = createSupabaseServerClient(request);

  const userData = await supabaseClient.auth.getUser();

  // Return the data as JSON to be used in the component
  return json({
    userId: userData.data.user?.id,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const { supabaseClient, headers } = createSupabaseServerClient(request);

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
      return json({ intent, success: false }, { headers });
    }

    return json({ intent, success: true }, { headers });
  }

  if (intent === "logout") {
    // sign out
    await supabaseClient.auth.signOut();
    return redirect("/", {
      headers,
    });
  }

  return json({ intent, success: false }, { headers });
};

export default function App() {
  const { userId } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header
          actionIntent={actionData?.intent}
          actionSuccess={actionData?.success}
          isLoggedIn={Boolean(userId)}
        />
        <Outlet />
        <ScrollRestoration />
        <Footer />
        <Scripts />
      </body>
    </html>
  );
}
