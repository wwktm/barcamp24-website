import { ActionFunction, redirect } from "@remix-run/node";
import { createClient } from "~/utils/supabase.server";

export const action: ActionFunction = async ({ request }) => {
  const { supabaseClient, headers } = createClient(request);

  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "login") {
    const email = formData.get("email") as string;

    const { error } = await supabaseClient.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: process.env.SUPABASE_CALLBACK_URL,
      },
    });

    if (error) {
      return { intent, success: false };
    }

    return { intent, success: true };
  }

  if (intent === "logout") {
    // sign out
    await supabaseClient.auth.signOut();
    return redirect("/", {
      headers,
    });
  }

  return { intent, success: false };
};
