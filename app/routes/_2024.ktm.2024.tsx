import { MetaFunction } from "@remix-run/node";
import EventDescription from "~/ktm-2024/components/homepage/EventDescription";
import EventManagement from "~/ktm-2024/components/homepage/EventManagement";
import Faq from "~/ktm-2024/components/homepage/Faq";
import Schedule from "~/ktm-2024/components/homepage/Schedule";
import scheduleBoard from "~/ktm-2024/images/schedule.jpeg";

export const meta: MetaFunction = () => {
  return [
    { title: "BarCamp Kathmandu 2024" },
    {
      property: "og:title",
      content: "BarCamp Kathmandu 2024",
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
      content: "https://barcamp.wwktm.com/ktm-2024/barcamp-og.png",
    },
  ];
};

export default function Ktm2024() {
  return (
    <>
      <EventDescription />
      <div className="proposals py-12">
        <div className="container">
          <h2 className="sm:text-3xl text-3xl font-bold mb-12 text-center">
            Scheduling Board
          </h2>
          <a href={scheduleBoard} target="_blank" rel="noopener noreferrer">
            <img src={scheduleBoard} alt="Scheduling Board" />
          </a>
        </div>
      </div>
      <EventManagement />
      <Schedule />
      <Faq />
    </>
  );
}
