import type { MetaFunction, ActionFunction } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import ProposalForm from "~/components/proposals/ProposalForm";
import { Json } from "~/types/database.types";
import { createSupabaseServerClient } from "~/utils/supabase.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Request Proposal - BarCamp Kathmandu 2024" },
    {
      name: "description",
      content: "Request a proposal for BarCamp Kathmandu 2024",
    },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const tags = formData.get("tags") as string;
  const description = formData.get("description") as string;

  const speakers: Json[] = [];

  formData.forEach((value, key) => {
    const match = key.match(/^speakers\[(\d+)]\[(\w+)]$/);
    if (match) {
      const [, index, field] = match; // Extract index and field name
      if (index && field) {
        const idx = parseInt(index, 10);

        // Ensure the speakers array has an object for the current index
        if (!speakers[idx])
          speakers[idx] = { name: "", photoUrl: "", profileLink: "" };

        // Assign the value to the appropriate field of the speaker
        speakers[idx][field as keyof Json] = value as never;
      }
    }
  });

  const { supabaseClient } = createSupabaseServerClient(request);

  const { error } = await supabaseClient.from("proposals").insert({
    title,
    tags: tags.split(",").map((tag) => tag.trim()),
    description,
    speakers,
  });

  if (error) {
    console.error("Supabase Insert Error:", error);
    return { error: true, success: false };
  }

  return { success: true, error: false };
};

export default function RequestProposal() {
  const data = useActionData<typeof action>();
  return (
    <>
      <section className="text-xl leading-loose bg-gray-200 border-b-2 border-orange-400 rotate-1">
        <div className="container">
          <h1 className="text-3xl font-bold">Request a Proposal</h1>
        </div>
      </section>

      <ProposalForm isSuccess={data?.success} hasError={data?.error} />
    </>
  );
}
