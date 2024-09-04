import { MetaFunction, LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import EventDescription from "~/components/homepage/EventDescription";
import Faq from "~/components/homepage/Faq";
import Proposals from "~/components/homepage/Proposals";
import { createSupabaseServerClient } from "~/utils/supabase.server";

export const meta: MetaFunction = () => {
  return [
    { title: "BarCamp Kathmandu 2024" },
    { name: "description", content: "Barcamp Kathmandu 2024" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const { supabaseClient } = createSupabaseServerClient(request);

  // Fetch data from the "topics" table in Supabase
  const { data, error } = await supabaseClient.from("proposals").select("*");

  // Handle any errors during data fetching
  if (error) {
    console.error("Error fetching proposals data:", error);
  }

  // Return the data as JSON to be used in the component
  return json({ proposals: data || [] });
};

export default function Index() {
  const { proposals } = useLoaderData<typeof loader>();
  return (
    <>
      <EventDescription />
      <Proposals proposals={proposals} />
      <Faq />
    </>
  );
}
