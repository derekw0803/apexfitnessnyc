import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getDb(): SupabaseClient {
    if (client) return client;

    const url = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
        throw new Error("SUPABASE_SERVICE_ROLE_KEY must be set before using the database.");
    }

    if (!url) {
        throw new Error("SUPABASE_URL must be set before using the database.");
    }

    client = createClient(url, serviceRoleKey, {
        auth: {
            persistSession: false,
        },
        db: {
            schema: "public",
        },
    });

    return client;
}