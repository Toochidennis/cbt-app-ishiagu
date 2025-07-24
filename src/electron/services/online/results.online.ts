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

    // static async upsert(rows: Result[]) {
    //     if (!rows.length) return;

    //     const client = Supabase.getClient();

    //     await HelperOnline.upsertInBatches(
    //         client,
    //         this.table,
    //         rows.map(appToDb),
    //         'id'
    //     );
    // }

    static async upsert(rows: Result[]) {
        if (!rows.length) return;

        const client = Supabase.getClient();

        // Step 1: Build OR filter
        const orFilters = rows.map(row => {
            const composite = [
                `student_id.eq.${row.studentId}`,
                `subject_id.eq.${row.subjectId}`,
                `class_id.eq.${row.classId}`,
                `term.eq.${row.term}`,
                `year.eq.${row.year}`
            ].join(',');

            return `id.eq.${row.id},and(${composite})`;
        });

        // Step 2: Query for existing entries (by ID or composite key)
        const { data: existing, error } = await client
            .from(this.table)
            .select('id, student_id, subject_id, class_id, term, year')
            .or(orFilters.join(','))
            .limit(5000); // increase if needed

        if (error) throw new Error(`Error checking for existing ${this.table}: ${error.message}`);

        // Step 3: Filter out existing rows from input
        const filteredRows = rows.filter(row => {
            const idConflict = existing?.some(e => e.id === row.id);
            const compositeConflict = existing?.some(e =>
                e.student_id === row.studentId &&
                e.subject_id === row.subjectId &&
                e.class_id === row.classId &&
                e.term === row.term &&
                e.year === row.year
            );
            return !(idConflict || compositeConflict);
        });

        if (!filteredRows.length) return;

        // Step 4: Proceed with upsert on `id`
        await HelperOnline.upsertInBatches(
            client,
            this.table,
            filteredRows.map(appToDb),
            'id' // still use `id` as conflict target
        );
    }

}
