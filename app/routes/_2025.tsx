import { LinksFunction } from "@remix-run/node";
import stylesheet from "~/css/style.css?url";

import Header from "~/components/layout/Header";
import Footer from "~/components/layout/Footer";
import { Outlet } from "@remix-run/react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  {
    rel: "icon",
    type: "image/png",
    href: "/favicon.png",
  },
];

export default function Layout2024() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
