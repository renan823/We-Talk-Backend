import * as mongoose from "mongoose";

export const suggestionSchema = mongoose.Schema({
    to: {
        type: String,
        required: true
    },
    users: {
        type: [String],
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now
    }
})

suggestionSchema.set('timestamps', true);

export const Suggestion = mongoose.model("Suggestion", suggestionSchema);
