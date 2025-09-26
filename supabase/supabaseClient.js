import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

if (supabase) {
	console.log("Connected to Supabase!");
} else {
	console.log("Failed to connect to Supabase");
}

export default supabase;
