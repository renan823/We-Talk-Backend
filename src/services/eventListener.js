import mongoose from "mongoose";

const { User } = require("../schemas/User");
const { Message } = require("../schemas/Message");

const sockets = new Map();

export const events = {
    "open": async (ws, data) => {
        console.log("opening socket")
        const id = data.id;
        const user = await User.findById(id);

        if (user) {
            user.socket = ws.id;
            user.save();

            sockets.set(ws.id, ws);

            ws.send(JSON.stringify({ id: "connected", data: {} }));
            return;
        }

        return;
    },
    "close": async (ws, data) => {
        console.log("closing socket")
        const id = data.id;
        const user = await User.findById(id);

        if (user) {
            user.socket = null;
            user.save();
        }

        return;
    },
    "send": async (ws, data) => {

        await Message.create(data.message);

        const id = data.id;
        const user = await User.findById(id);
        const target = user.socket;

        console.log(data.message)

        if (target) {
            sockets(target).send(JSON.stringify(data.message));
        }

        return;
    },
    "received": async (ws, data) => {
        const lastDate = data.lastDate;
        const chat = mongoose.Types.ObjectId(data.chat)

        await Message.updateMany({ date: { $lt: lastDate }, chat: chat }, { $set: { status: "received" } });
    }
}


export const eventListener = (message, ws) => {
    events[message.event](ws, message.data);
}

// const messages = await Message.aggregate([{ $match: { $or: [{ to: user.name }, { from: user.name }] } }, { $group: { _id: '$chat' } }]);