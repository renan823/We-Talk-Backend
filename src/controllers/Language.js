import { Language } from "../schemas/Language";

export const create = async ({ body, set }) => {
    try {
        const language = await Language.create(body);

        set.status = 201;
        return { "message": "Linguagem criada", "language": language };
    } catch(error) {
        set.status = 500;
        return { "message": "Algo deu errado" };
    }
}

export const findAll = async ({ set }) => {
    const result = await Language.find();

    const languages = [];
    result.forEach(language => {
        languages.push({"label": language.name, "value": language._id })
    })

    set.status = 200;
    return { "message": "Resultados obtidos", "languages": languages };
}