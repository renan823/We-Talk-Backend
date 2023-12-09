import mongoose from "mongoose";

const { User } = require("../schemas/User");
const { Message } = require("../schemas/Message");

export const sockets = new Map();

export const events = {
    "open": async (ws, data) => {
        console.log("opening socket");
        const user = data.name;

        if (user) {
            if (! sockets.has(user)) {
                sockets.set(user, ws);
            }
        }

        return;
    },
    "close": async (ws, data) => {
        console.log("closing socket")
        const id = data.id;
        const user = await User.findById(id);

        if (user) {
            sockets.delete(user.name);
        }

        return;
    },
    "send": async (ws, data) => {

        const message = await Message.create(data.message);

        const user = data.message.to;
        data.message = message;

        if (sockets.has(user)) {
            const socket = sockets.get(user);
            socket.send(JSON.stringify({ event: 'send', data }));
        }

        return;
    },
    "received": async (ws, data) => {
        const lastDate = data.lastDate;
        const chat = mongoose.Types.ObjectId(data.chat);

        await Message.updateMany({ date: { $lt: lastDate }, chat: chat }, { $set: { status: "received" } });
    }
}


export const eventListener = (message, ws) => {
    events[message.event](ws, message.data);
}

// const messages = await Message.aggregate([{ $match: { $or: [{ to: user.name }, { from: user.name }] } }, { $group: { _id: '$chat' } }]);