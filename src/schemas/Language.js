import * as mongoose from "mongoose";

export const languageSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
})

export const Language = mongoose.model("Language", languageSchema);