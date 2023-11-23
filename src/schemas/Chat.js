import * as mongoose from "mongoose";

export const chatSchema = mongoose.Schema({
    users: {
        type: [String],
        required: true
    }
})

export const Chat = mongoose.model("Chat", chatSchema);
