import { appToDb, dbToApp } from "../../../electron/util/caseTransform";
import { ExamSchedule } from "../sqlite/models";
import { Supabase } from "./superbaseClient.online";
import { HelperOnline } from "./helper.online";

export class ExamSchedulesOnline {
    private static table: string = 'exam_schedules';

    static async fetchSince(timestamp: string): Promise<ExamSchedule[]> {
        const client = Supabase.getClient();

        return await HelperOnline.fetchAllMatching<ExamSchedule>(
            client,
            this.table,
            (q) => q.gt('updated_at', timestamp),
            dbToApp
        );
    }

    static async upsert(rows: ExamSchedule[]) {
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
