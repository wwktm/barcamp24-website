import { LinksFunction, LoaderFunction } from "@remix-run/node";
import stylesheet from "~/css/style.css?url";

import Header from "~/components/layout/Header";
import Footer from "~/components/layout/Footer";
import { Outlet, useLoaderData } from "@remix-run/react";

import { createClient } from "~/utils/supabase.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  {
    rel: "icon",
    type: "image/png",
    href: "/favicon.png",
  },
];

export const loader: LoaderFunction = async ({ request }) => {
  const { supabaseClient } = createClient(request);

  const userData = await supabaseClient.auth.getUser();

  // Return the data as JSON to be used in the component
  return {
    userId: userData.data.user?.id,
  };
};

export default function Layout2025() {
  const { userId } = useLoaderData<typeof loader>();

  return (
    <>
      <Header isLoggedIn={Boolean(userId)} />
      <Outlet />
      <Footer />
    </>
  );
}
