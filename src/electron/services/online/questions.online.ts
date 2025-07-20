import { appToDb, dbToApp } from "../../../electron/util/caseTransform";
import type { Question } from "../sqlite/models";
import { Supabase } from "./superbaseClient.online";
import { HelperOnline } from "./helper.online";

export class QuestionsOnline {
    private static table: string = 'questions';

    static async fetchSince(timestamp: string): Promise<Question[]> {
        const client = Supabase.getClient();

        return await HelperOnline.fetchAllMatching<Question>(
            client,
            this.table,
            (q) => q.gt('updated_at', timestamp),
            dbToApp
        );
    }

    static async upsert(rows: Question[]) {
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
