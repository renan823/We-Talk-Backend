import { Message } from "../schemas/Message";

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

export const findByChat = async ({ body, set }) => {
    try {
        const messages = await Message.aggregate([{ $match: body }, { $group: { _id: { $dateToString: { format: "%d-%m-%Y", date: "$date" } } } }]);

        set.status = 200;
        return { message: "Ok", messages };
    } catch(error) {
        set.status = 500;
        return { message: "Algo deu errado" };
    }
}
