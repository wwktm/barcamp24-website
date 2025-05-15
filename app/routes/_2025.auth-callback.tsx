import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { createClient } from "~/utils/supabase.server";

export const loader = async ({ request }: ActionFunctionArgs) => {
  const url = new URL(request.url);
  const tokenHash = url.searchParams.get("token_hash");
  if (tokenHash) {
    const { supabaseClient, headers } = createClient(request);
    const { error } = await supabaseClient.auth.verifyOtp({
      token_hash: tokenHash,
      type: "email",
    });

    if (error) {
      return redirect("/login");
    }
    return redirect("/", {
      headers,
    });
  }
  return new Response("Authentication failed", {
    status: 401,
  });
};
