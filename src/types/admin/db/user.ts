export type usersDb {
    id: uuid!
    username: String!
    password_hash: String!
    role: String!
    surname: String!
    first_name: String!
    middle_name: String
    gender: String
    date_of_birth: Date
    created_at: timestamptz!
}
