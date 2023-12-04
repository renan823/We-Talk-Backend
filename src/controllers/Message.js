import { Message } from "../schemas/Message";
import { User } from "../schemas/User";

export const create = async ({ body, set }) => {
    try {
        const message = await Message.create(body);

        set.status = 201;
        return { message };
    } catch(error) {
        set.status = 500;
        return { message: "Algo deu errado" };
    }
}

export const findByChat = async ({ auth, set }) => {
    try {
        const messages = await Message.aggregate([
            { 
                $match: {
                    $or: [
                        { to: auth.name },
                        { from: auth.name }
                    ]
                }
            },
            {
                $sort: {
                    createdAt: 1 
                }
            },
            {
                $group: {
                    _id: '$chat',
                    messages: { $push: '$$ROOT' }
                }
            } 
        ]);

        set.status = 200;
        return { message: "Ok", messages };
    } catch(error) {
        set.status = 500;
        return { message: "Algo deu errado" };
    }
}
