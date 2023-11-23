const User = require("../schemas/User");
const Message = require("../schemas/Message");

export const events = {
    "OPEN": async (ws, id) => {
        const user = await User.findById(id);

        if (user) {
            user.socket = ws.id;
            user.save();

            //ws.send(JSON.stringify({ id: "RECEIVE", data: { messages } }));
            return;
        }

        return;
    },
    "CLOSE": async (id) => {
        const user = await User.findById(id);

        if (user) {
            user.socket = null;
            user.save();
        }

        return;
    },
}


export const eventListener = (message, ws) => {
    console.log(message)
}

// const messages = await Message.aggregate([{ $match: { $or: [{ to: user.name }, { from: user.name }] } }, { $group: { _id: '$chat' } }]);