import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Replace with the user's actual keys if they are in the .env instead
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vjlxnomjxmqztuqtncxa.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_nkyfbrLLrCCycdHg9hoGng_XMJ1hgn_'; // NOTE: Ideally we use a Service Role Key, but if it works with anon, let's try.

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSqlFile(filename) {
    const filePath = path.join(__dirname, filename);
    const sql = fs.readFileSync(filePath, 'utf8');

    console.log(`Executing ${filename}...`);
    // Unfortunately Supabase REST API doesn't have a direct "execute arbitrary SQL" endpoint via the JS client
    // unless there is a specific RPC function setup for it.
    // So we'll try to use a standard REST command like rpc if it exists, otherwise this will fail.
    const { data, error } = await supabase.rpc('run_sql', { sql_query: sql });

    if (error) {
        console.error(`Error executing ${filename}:`, error.message);
        // Let's print out what we would have done, and tell the user they might need to do it manually.
        console.log(`Could not execute SQL automatically. Supabase 'anon' key generally does not have permissions to run DDL (CREATE TABLE) commands unless via a custom RPC.`);
        return false;
    }

    console.log(`Successfully executed ${filename}`);
    return true;
}

async function main() {
    console.log("Starting DB initialization...");
    const files = ['setup_database.sql', 'settings.sql', 'setup_orders.sql'];

    for (const file of files) {
        await runSqlFile(file);
    }
    console.log("Finished.");
}

main();
