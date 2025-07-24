import type { User } from "../sqlite/models";
import { appToDb, dbToApp } from "../../../electron/util/caseTransform";
import { Supabase } from "./superbaseClient.online";
import { HelperOnline } from "./helper.online";

export class UsersOnline {
    private static table: string = 'users';

    static async fetchSince(timestamp: string): Promise<User[]> {
        const client = Supabase.getClient();

        return await HelperOnline.fetchAllMatching<User>(
            client,
            this.table,
            (q) => q.gt('updated_at', timestamp),
            dbToApp
        );
    }

    static async upsert(rows: User[]) {
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
