import type { Result } from '../sqlite/models';
import { appToDb, dbToApp } from "../../../electron/util/caseTransform";
import { Supabase } from './superbaseClient.online';
import { HelperOnline } from './helper.online';

export class ResultsOnline {
    private static table: string = 'results';

    static async fetchSince(timestamp: string): Promise<Result[]> {
        const client = Supabase.getClient();

        return await HelperOnline.fetchAllMatching<Result>(
            client,
            this.table,
            (q) => q.gt('updated_at', timestamp),
            dbToApp
        );
    }

    static async upsert(rows: Result[]) {
        if (!rows.length) return;

        const client = Supabase.getClient();

        const { data, error } = await client
            .rpc('filter_new_results', {
                rows: rows.map(row => ({
                    id: row.id,
                    student_id: row.studentId,
                    subject_id: row.subjectId,
                    class_id: row.classId,
                    term: row.term,
                    year: row.year,
                    ca1: row.ca1,
                    ca2: row.ca2,
                    exam: row.exam,
                    grade: row.grade,
                    remarks: row.remarks,
                    approved: row.approved,
                    approved_at: row.approvedAt,
                    created_at: row.createdAt,
                    updated_at: row.updatedAt,
                })),
            });

        if (error) throw new Error('RPC failed: ' + error.message);

        if (data?.length) {
            await HelperOnline.upsertInBatches(
                client,
                this.table,
                data.map(appToDb),
                'id'
            );
        }
    }
}
