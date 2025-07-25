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

        const { data, error } = await
            client.rpc('filter_new_exam_attempts', {
                rows: rows.map(row => ({
                    id: row.id,
                    exam_schedule_id: row.examScheduleId,
                    student_id: row.studentId,
                    status: row.status,
                    created_at: row.createdAt,
                    updated_at: row.updatedAt,
                })),
            });

        if (error) throw new Error('RPC failed: ' + error.message);

        if (data?.length) {
            await HelperOnline.upsertInBatches(
                client,
                'exam_attempts',
                data.map(appToDb),
                'id'
            );
        }
    }
}
