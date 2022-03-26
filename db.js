import mongoose from 'mongoose'

export const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
    } catch {
        process.exit(1)
    }
}