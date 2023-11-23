import * as mongoose from "mongoose";

export const userSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    biography: {
        type: String,
        required: true
    },
    speak: {
        type: [String],
        required: true
    },
    learn: {
        type: [String],
        required: true
    },
    picture: { 
        type: Buffer,
    },
    extension: {
        type: String
    },
    socket: {
        type: String
    }
})

export const User = mongoose.model("User", userSchema);
