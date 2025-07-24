import type { Setting } from "../sqlite/models";
import { appToDb, dbToApp } from "../../../electron/util/caseTransform";
import { Supabase } from "./superbaseClient.online";
import { HelperOnline } from "./helper.online";

export class SettingsOnline {
    private static table: string = 'settings';

    static async fetchSince(timestamp: string): Promise<Setting[]> {
        const client = Supabase.getClient();

        return await HelperOnline.fetchAllMatching<Setting>(
            client,
            this.table,
            (q) => q.gt('updated_at', timestamp),
            dbToApp
        );
    }

    static async upsert(rows: Setting[]) {
        if (!rows.length) return;

        const client = Supabase.getClient();

        await HelperOnline.upsertInBatches(
            client,
            this.table,
            rows.map(appToDb),
            'id'
        );
    }
}
