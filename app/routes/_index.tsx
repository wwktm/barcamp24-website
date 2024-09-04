import { MetaFunction, LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import EventDescription from "~/components/homepage/EventDescription";
import EventManagement from "~/components/homepage/EventManagement";
import Faq from "~/components/homepage/Faq";
import Proposals from "~/components/homepage/Proposals";
import { createSupabaseServerClient } from "~/utils/supabase.server";

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
      content: "https://barcamp.wwktm.com/barcamp-og.png",
    },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const { supabaseClient } = createSupabaseServerClient(request);

  // Fetch data from the "topics" table in Supabase
  const { data, error } = await supabaseClient
    .from("proposals")
    .select("*")
    .eq("status", "voting")
    .order("upvotes", { ascending: false });

  const userData = await supabaseClient.auth.getUser();
  const upVotedProposals = [];
  if (userData.data.user) {
    const { data } = await supabaseClient
      .from("proposal_upvotes")
      .select("proposal_id")
      .eq("user_id", userData.data.user.id);

    if (data) {
      upVotedProposals.push(...data.map((vote) => vote.proposal_id));
    }
  }

  // Handle any errors during data fetching
  if (error) {
    console.error("Error fetching proposals data:", error);
  }

  // Return the data as JSON to be used in the component
  return json({
    proposals: data || [],
    userId: userData.data.user?.id,
    upVotedProposals,
  });
};

export default function Index() {
  const { proposals, userId, upVotedProposals } =
    useLoaderData<typeof loader>();
  return (
    <>
      <EventDescription />
      <Proposals
        proposals={proposals}
        userId={userId}
        upVotedProposals={upVotedProposals}
      />
      <EventManagement />
      <Faq />
    </>
  );
}
