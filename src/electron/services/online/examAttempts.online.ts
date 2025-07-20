import type { ExamAttempt } from "../sqlite/models";
import { appToDb, dbToApp } from "../../../electron/util/caseTransform";
import { Supabase } from "./superbaseClient.online";
import { HelperOnline } from "./helper.online";


export class ExamAttemptsOnline {
    private static table: string = 'exam_attempts';

    static async fetchSince(timestamp: string): Promise<ExamAttempt[]> {
        const client = Supabase.getClient();

        return await HelperOnline.fetchAllMatching<ExamAttempt>(
            client,
            this.table,
            (q) => q.gt('updated_at', timestamp),
            dbToApp
        );
    }

    static async upsert(rows: ExamAttempt[]) {
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
