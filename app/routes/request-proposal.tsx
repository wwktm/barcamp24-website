import type { MetaFunction, ActionFunction } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import ProposalForm from "~/components/proposals/ProposalForm";
import { Json } from "~/types/database.types";
import { createSupabaseServerClient } from "~/utils/supabase.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Request Proposal - BarCamp Kathmandu 2024" },
    {
      property: "og:title",
      content: "Request Proposal - BarCamp Kathmandu 2024",
    },
    {
      name: "description",
      content: "Request a proposal for BarCamp Kathmandu 2024",
    },
    {
      property: "og:image",
      content: "https://barcamp.wwktm.com/barcamp-og.png",
    },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const tags = formData.get("tags") as string;
  const description = formData.get("description") as string;
  const email = formData.get("email") as string;
  const duration = formData.get("duration") as string;
  let session_category = formData.get("session_category") as string;
  const category_other = formData.get("category_other") as string;
  if (session_category === "Other") {
    session_category = category_other.trim() || session_category;
  }

  const speakers: Json[] = [];

  formData.forEach((value, key) => {
    const match = key.match(/^speakers\[(\d+)]\[(\w+)]$/);
    if (match) {
      const [, index, field] = match; // Extract index and field name
      if (index && field) {
        const idx = parseInt(index, 10);

        // Ensure the speakers array has an object for the current index
        if (!speakers[idx])
          speakers[idx] = {
            name: "",
            photoUrl: "",
            profileLink: "",
            introduction: "",
          };

        // Assign the value to the appropriate field of the speaker
        speakers[idx][field as keyof Json] = value as never;
      }
    }
  });

  const { supabaseClient } = createSupabaseServerClient(request);

  const { error } = await supabaseClient.from("proposals").insert({
    email,
    duration,
    session_category,
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
      <section className="py-20 bg-gray-100 bg-gradient-to-l from-sky-100 to-orange-50">
        <div className="container">
          <h1 className="sm:text-3xl text-3xl font-bold mb-0 text-center">
            Request a Proposal
          </h1>
        </div>
      </section>

      <ProposalForm isSuccess={data?.success} hasError={data?.error} />
    </>
  );
}
