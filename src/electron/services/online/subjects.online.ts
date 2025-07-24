import type { Subject } from "../sqlite/models";
import { appToDb, dbToApp } from "../../../electron/util/caseTransform";
import { Supabase } from './superbaseClient.online';
import { HelperOnline } from "./helper.online";

export class SubjectsOnline {
    private static table: string = 'subjects';

    static async fetchSince(timestamp: string): Promise<Subject[]> {
        const client = Supabase.getClient();

        return await HelperOnline.fetchAllMatching<Subject>(
            client,
            this.table,
            (q) => q.gt('updated_at', timestamp),
            dbToApp
        );
    }

    static async upsert(rows: Subject[]) {
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
