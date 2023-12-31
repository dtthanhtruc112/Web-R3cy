export interface Discount {
    _id: String,
    code: String,
    title: String,
    description: String,
    status: String,
    activate_date: String,
    expired_date: String,
    valuecode: Number,
    userids: {userid: number }[]
}