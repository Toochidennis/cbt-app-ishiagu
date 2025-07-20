
import { appToDb, dbToApp } from '../../../electron/util/caseTransform';
import { Grade } from '../sqlite/models';
import { Supabase } from './superbaseClient.online';
import { HelperOnline } from './helper.online';

export class GradesOnline {
    private static table: string = 'grades';

    static async fetchSince(timestamp: string): Promise<Grade[]> {
        const client = Supabase.getClient();

        return await HelperOnline.fetchAllMatching<Grade>(
            client,
            this.table,
            (q) => q.gt('updated_at', timestamp),
            dbToApp
        );
    }

    static async upsert(grades: Grade[]) {
        if (!grades.length) return;

        const client = Supabase.getClient();

        await HelperOnline.upsertInBatches(
            client,
            this.table,
            grades.map(appToDb),
            'id'
        );
    }
}
