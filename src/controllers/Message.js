
import { Message } from "../schemas/Message";

export const create = async ({ auth, body, set }) => {
    if (auth) {
        try {
            const message = await Message.create(body);
    
            set.status = 201;
            return { message };
        } catch(error) {
            set.status = 500;
            return { message: "Algo deu errado" };
        }
    }
}

export const findByChat = async ({ auth, body, set }) => {
    if (auth) {
        try {
            const messages = await Message.find({ chat: body.chat }).sort({ createdAt: 1 });
            
            set.status = 200;
            return { message: "Ok", messages: messages };
        } catch(error) {
            set.status = 500;
            return { message: "Algo deu errado" };
        }
    }
}
