import type { MetaFunction } from "@remix-run/node";
import EventDescription from "~/components/homepage/EventDescription";
import Faq from "~/components/homepage/Faq";
import Proposals from "~/components/homepage/Proposals";

export const meta: MetaFunction = () => {
  return [
    { title: "BarCamp Kathmandu 2024" },
    { name: "description", content: "Barcamp Kathmandu 2024" },
  ];
};

export default function Index() {
  return (
    <>
      <EventDescription />
      <Proposals />
      <Faq />
    </>
  );
}
