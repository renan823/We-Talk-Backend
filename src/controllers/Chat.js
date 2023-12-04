import { Chat } from "../schemas/Chat";
import { User } from "../schemas/User";

export const create = async ({ auth, body, set }) => {
    if (auth) {
        try {
            const pair = [auth.name, body.follower];
            pair.sort();
    
            const users = await User.find({ name: { $in: pair }});
            if (users.length === 2) {
                const chat = await Chat.count({ users: pair });
                if (!chat) {
                    const newChat = await Chat.create({ users: pair });
    
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
    } else {
        set.status = 401;
        return { message: "Sem token!" }
    }
}

export const findAllByUser = async ({ auth, set }) => {
    if (auth) {
        try {
            const chats = await Chat.find({ users: auth.name });
            console.log(await Chat.find())
    
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
