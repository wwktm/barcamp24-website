import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import BarcampImages from "~/components/homepage/BarcampImages";
import EventDescription from "~/components/homepage/EventDescription";
import EventManagement from "~/components/homepage/EventManagement";
import Faq from "~/components/homepage/Faq";
import Proposals from "~/components/homepage/Proposals";

import { createClient } from "~/utils/supabase.server";
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

export const loader: LoaderFunction = async ({ request }) => {
  const { supabaseClient } = createClient(request);

  // Fetch data from the "topics" table in Supabase
  const { data, error } = await supabaseClient
    .from("proposals")
    .select("*")
    .eq("status", "voting");

  // Handle any errors during data fetching
  if (error) {
    console.error("Error fetching proposals data:", error);
  }

  // Return the data as JSON to be used in the component
  return {
    proposals: data?.sort(() => Math.random() - 0.5) || [],
  };
};

export default function Index() {
  const { proposals } = useLoaderData<typeof loader>();

  return (
    <>
      <EventDescription />
      <BarcampImages />
      <Proposals proposals={proposals} />
      <EventManagement />
      <Faq />
    </>
  );
}
