import * as mongoose from "mongoose";

export const messageSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    chat: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: ['sended', 'received'],
        default: 'sended'
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
})


export const Message = mongoose.model("Message", messageSchema);


