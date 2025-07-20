import { appToDb, dbToApp } from "../../../electron/util/caseTransform";
import type { Assessment } from "../sqlite/models";
import { Supabase } from "./superbaseClient.online";
import { HelperOnline } from "./helper.online";

export class AssessmentsOnline {
    private static table: string = 'assessments';

    static async fetchSince(timestamp: string): Promise<Assessment[]> {
        const client = Supabase.getClient();

        return await HelperOnline.fetchAllMatching<Assessment>(
            client,
            this.table,
            (q) => q.gt('updated_at', timestamp),
            dbToApp
        );
    }

    static async upsert(rows: Assessment[]) {
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
