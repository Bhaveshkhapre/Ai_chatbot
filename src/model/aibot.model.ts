import mongoose, { model, Schema } from "mongoose";
interface AiBot {
    ownerId: string,
    businessName: string
    supportEmail: string
    knowledge: string
}
const aibotSchema = new Schema<AiBot>({

    ownerId: {
        type: String,
        required: true,
        unique: true
    },
    businessName: {
        type: String
    },
    supportEmail: {
        type: String
    },
    knowledge: {
        type: String
    }

}, { timestamps: true })


const Settings = mongoose.models.Settings || model("Settings", aibotSchema)

export default Settings