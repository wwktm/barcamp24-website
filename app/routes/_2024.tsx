import { LinksFunction } from "@remix-run/node";
import stylesheet from "~/ktm-2024/css/style.css?url";

import Header from "~/ktm-2024/components/layout/Header";
import Footer from "~/ktm-2024/components/layout/Footer";
import { Outlet } from "@remix-run/react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  {
    rel: "icon",
    type: "image/png",
    href: "/ktm-2024/favicon.png",
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
