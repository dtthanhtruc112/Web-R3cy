export interface Discount {
    code: String,
    title: String,
    description: String,
    status: String,
    activate_date: String,
    expired_date: String,
    userids: {userid: number }[]
}