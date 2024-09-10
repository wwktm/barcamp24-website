import {
  MetaFunction,
  LoaderFunction,
  json,
  ActionFunction,
} from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
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
    .select("*, proposal_upvotes(count)")
    .eq("status", "voting")
    .order("upvotes", { ascending: false });

  const userData = await supabaseClient.auth.getUser();
  const upVotedProposals: number[] = [];
  if (userData.data.user) {
    const { data: proposalUpVoteData } = await supabaseClient
      .from("proposal_upvotes")
      .select("proposal_id")
      .eq("user_id", userData.data.user.id);

    if (proposalUpVoteData) {
      upVotedProposals.push(
        ...proposalUpVoteData.map((vote) => vote.proposal_id)
      );
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

export const action: ActionFunction = async ({ request }) => {
  const { supabaseClient, headers } = createSupabaseServerClient(request);

  const formData = await request.formData();
  const intent = formData.get("intent");

  const proposalId = formData.get("proposal_id") as string;
  const userData = await supabaseClient.auth.getUser();
  if (proposalId && userData.data.user) {
    if (intent === "upvote") {
      const { error } = await supabaseClient.from("proposal_upvotes").insert({
        proposal_id: parseInt(proposalId, 10),
        user_id: userData.data.user.id,
      });

      if (!error) {
        return json({ intent, proposalId, success: true }, { headers });
      }
    }

    if (intent === "remove_upvote") {
      const { error } = await supabaseClient
        .from("proposal_upvotes")
        .delete()
        .eq("proposal_id", parseInt(proposalId, 10))
        .eq("user_id", userData.data.user.id);

      if (!error) {
        return json({ intent, proposalId, success: true }, { headers });
      }
    }
  }

  return json({ intent, success: false }, { headers });
};

export default function Index() {
  const { proposals, userId, upVotedProposals } =
    useLoaderData<typeof loader>();
  const submit = useSubmit();

  const handleUpvoteChange = (proposalId: number) => {
    if (!userId) return;

    const formData = new FormData();
    if (upVotedProposals.includes(proposalId)) {
      formData.append("intent", "remove_upvote");
    } else {
      formData.append("intent", "upvote");
    }

    formData.append("proposal_id", proposalId.toString());
    submit(formData, { method: "post" });
  };

  return (
    <>
      <EventDescription />
      <Proposals
        proposals={proposals}
        userId={userId}
        upVotedProposals={upVotedProposals}
        handleUpvoteChange={handleUpvoteChange}
      />
      <EventManagement />
      <Faq />
    </>
  );
}
