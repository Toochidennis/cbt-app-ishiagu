import { Class } from '../sqlite/models';
import { appToDb, dbToApp } from "../../../electron/util/caseTransform";
import { Supabase } from './superbaseClient.online';
import { HelperOnline } from './helper.online';

export class ClassesOnline {
    private static table: string = 'classes';

    static async fetchSince(timestamp: string): Promise<Class[]> {
        const client = Supabase.getClient();

        return await HelperOnline.fetchAllMatching<Class>(
            client,
            this.table,
            (q) => q.gt('updated_at', timestamp),
            dbToApp
        )
    }

    static async upsert(rows: Class[]) {
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
