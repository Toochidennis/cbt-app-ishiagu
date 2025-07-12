import type { User } from "../sqlite/models";
import { appToDb, dbToApp } from "../../../electron/util/caseTransform";
import { Supabase } from "./superbaseClient.online";

export class UsersOnline {
    static async fetchSince(timestamp: string): Promise<User[]> {
        const client = Supabase.getClient();
        const { data, error } = await client
            .from('users')
            .select('*')
            .gt('updated_at', timestamp);

        if (error) throw new Error(`Supabase error fetching users: ${error.message}`);
        if (!data) return [];

        return data.map((row) => dbToApp<User>(row));
    }

    static async upsert(rows: User[]) {
        console.log('Heelo, ',rows);
        if (!rows.length) return;

        const client = Supabase.getClient();
        const payload = rows.map(appToDb)

        console.log('hshshshjdhdjhdhd ', payload);
        const { error } = await client
            .from('users')
            .upsert(payload, { onConflict: 'id' });

        if (error) throw new Error(`Supabase error inserting users: ${error.message}`);
    }
}
