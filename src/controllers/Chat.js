import { Chat } from "../schemas/Chat";
import { User } from "../schemas/User";

export const create = async ({ body, set }) => {
    try {
        const pair = [body.user, body.follower];
        pair.sort();

        const users = await User.find({ name: { $in: pair }});
        if (users.length === 2) {
            const chat = await Chat.count({ users: pair });
            if (!chat) {
                const newChat = await Chat.create(pair);

                set.status = 200;
                return { message: "Ok", newChat };
            }
            set.status = 201;
            return { message: "Ok", chat };
        }
    } catch(error) {
        set.status = 500;
        return { message: "Algo deu errado" };
    }
}

export const findAllByUser = async ({ auth, set }) => {
    if (auth) {
        try {
            const chats = await Chat.find({ users: auth.name });
    
            set.status = 200;
            return { message: "Ok", chats };
    
        } catch(error) {
            set.status = 500;
            return { message: "Algo deu errado" };
        }
    }

    set.status = 401;
    return { message: "Sem token" };
}
