import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
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

    const speakers: any[] = [];

    formData.forEach((value, key) => {
      const match = key.match(/^speakers\[(\d+)\]\[(\w+)\]$/);
      if (match) {
        const [, indexStr, field] = match;
        if (indexStr && field) {
          const idx = parseInt(indexStr, 10);
          if (!speakers[idx]) {
            speakers[idx] = {
              name: "",
              photoUrl: "",
              profileLink: "",
              introduction: "",
            };
          }
          speakers[idx][field] = value;
        }
      }
    });

    const filteredSpeakers = speakers.filter(Boolean);

    const supabaseUrl = import.meta.env.SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Missing Supabase URL or Anon Key configuration.");
      return new Response(
        JSON.stringify({ success: false, error: "Configuration Error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { error } = await supabase.from("proposals").insert({
      email,
      duration,
      session_category,
      title,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      description,
      speakers: filteredSpeakers,
    });

    if (error) {
      console.error("Supabase Insert Error:", error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("API handler error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
