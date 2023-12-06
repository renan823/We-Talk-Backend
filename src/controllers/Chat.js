import { Chat } from "../schemas/Chat";
import { User } from "../schemas/User";

export const create = async ({ auth, body, set }) => {
    if (auth) {
        try {
            const pair = [auth.name, body.follower];
            pair.sort();
    
            const users = await User.find({ name: { $in: pair }});
            if (users.length === 2) {
                const result = await Chat.find({ users: pair });
                
                if (result.length === 0) {
                    const chat = await Chat.create({ users: pair });
    
                    set.status = 200;
                    return { message: "Ok", chat: chat };
                }
                set.status = 201;
                return { message: "Ok", chat: result[0] };
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
