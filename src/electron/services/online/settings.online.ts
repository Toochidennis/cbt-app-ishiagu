import type { Setting } from "../sqlite/models";
import { appToDb, dbToApp } from "../../../electron/util/caseTransform";
import { Supabase } from "./superbaseClient.online";

export class SettingsOnline {
    static async fetchSince(timestamp: string): Promise<Setting[]> {
        const client = Supabase.getClient();
        const { data, error } = await client
            .from('settings')
            .select('*')
            .gt('updated_at', timestamp);

        if (error) throw new Error(`Supabase error fetching settings: ${error.message}`);
        if (!data) return [];

        return data.map((row) => dbToApp<Setting>(row));
    }

    static async upsert(rows: Setting[]) {
        if (!rows.length) return;

        const client = Supabase.getClient();
        const payload = rows.map(appToDb);

        const { error } = await client
            .from('settings')
            .upsert(payload, {
                onConflict: 'id',
            });

        if (error) throw new Error(`Supabase error inserting settings: ${error.message}`);
    }
}
