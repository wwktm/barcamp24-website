import { MetaFunction } from "@remix-run/node";
import EventDescription from "~/components/homepage/EventDescription";
import Faq from "~/components/homepage/Faq";
export const meta: MetaFunction = () => {
  return [
    { title: "BarCamp Kathmandu 2025" },
    {
      property: "og:title",
      content: "BarCamp Kathmandu 2025",
    },
    {
      name: "description",
      content:
        "Barcamp Kathmandu is an unconference - an ad hoc gathering born from the desire for people to share and learn in an open environment.  It is an opportunity for people to come together to learn, network, and discuss great ideas in person.",
    },
    {
      property: "og:description",
      content:
        "Barcamp Kathmandu is an unconference - an ad hoc gathering born from the desire for people to share and learn in an open environment.  It is an opportunity for people to come together to learn, network, and discuss great ideas in person.",
    },
    {
      property: "og:image",
      content: "https://barcamp.wwktm.com/barcamp-og.png",
    },
  ];
};

export default function Index() {
  return (
    <>
      <EventDescription />
      <Faq />
    </>
  );
}
