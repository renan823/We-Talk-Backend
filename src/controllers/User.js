import { User } from "../schemas/User";
import * as Suggestion from "./Suggestion";
import { Chat } from "../schemas/Chat";
const fs = require("fs");

export const create = async ({ body, set }) => {
    try {
        body.password = await Bun.password.hash(body.password);

        body.learn = body.learn.map(a => a["label"]);
        body.speak = body.speak.map(a => a["label"]);

        const user = await User.create(body);

        user.password = null;
        set.status = 201;
        return { message: "Usuário criado", user: user };
    } catch(error) {
        if (error.code === 11000) { //duplicate name
            set.status = 403;
            return { message: "Esse nome já está em uso!" };
        }
        set.status = 500;
        return { message: "Algo deu errado" };
    }
}

export const signIn = async ({ body, set, jwt, cookie, setCookie }) => {
    try {
        const user = await User.findOne({ name: body.name }).select('+password');

        if (user) {
            const password = body.password;
            const hash = user.password;

            const match = await Bun.password.verify(password, hash);
            if (match) {

                delete cookie['auth'];

                setCookie('auth', await jwt.sign({ name: user.name, id: user.id }), {
                    httpOnly: true,
                    maxAge: 7 * 86400,
                })
            
                user.password = null;
                
                set.status = 200;
                return { message: "Login realizado", user: user };
            }
            set.status = 403;
            return { message: "Usuário/Senha incorretos" };
        }
        set.status = 403;
        return { message: "Este usuário não existe" };
    } catch(error) {
        set.status = 500;
        return { message: "Algo deu errado" };
    }
}

export const findAll = async ({ set }) => {
    try {
        const users = await User.find();

        set.status = 200;
        return { message: "Resultados encontrados", "users": users };
    } catch(error) {
        set.status = 500;
        return { message: "Algo deu errado" };
    }
}

export const getFeed = async ({ auth, set }) => {
    if (auth) {
        const user = await User.findById(auth.id);
        const suggestion = await Suggestion.create(user);
        
        const suggestions = await User.find({ name: suggestion.users });

        set.status = 200;
        return { suggestions: suggestions };
    }

    set.status = 401;
    return { message: "Sem token" };
}

export const getFollowers = async ({ auth, set }) => {
    if (auth) {
        try {
            const chats = await Chat.find({ users: auth.name });

            let followers = [];

            if (chats.length === 0) {
                set.status = 200;
                return { followers }
            } 

            chats.forEach(chat => {
                chat.users.forEach(user => {
                    if (user !== auth.name && !followers.includes(user)) {
                        followers.push(user)
                    }
                })
            })

            set.status = 200;
            return { followers }

        } catch(error) {
            set.status = 500;
            return { message: "Algo deu errado" };
        }
    }

    set.status = 401;
    return { message: "Sem token" };
}

export const signOut = async ({ cookie, set }) => {
    delete cookie.auth;
    
    set.status = 200;
    return { message: "Logout" };
}

export const setBiography = async ({ auth, body, set }) => {
    if (auth) {
        try {
            const user = await User.findById(auth.id);
    
            user.biography = body.biography;
            user.save();
    
            set.status = 200;
            return { message: "Biografia alterada" };
        } catch(error) {
            set.status = 500;
            return { message: "Algo deu errado" };
        }
    }

    set.status = 401;
    return { message: "Sem token" };
}

export const setLanguages = async ({ auth, body, set }) => {
    if (auth ) {
        try {
            const user = await User.findById(auth.id);
    
            user.learn = body.learn;
            user.speak = body.speak;
            user.save();
    
            set.status = 200;
            return { message: "Dados alterados" };
        } catch(error) {
            set.status = 500;
            return { message: "Algo deu errado" };
        }
    }

    set.status = 401;
    return { message: "Sem token" };
}

export const setImage = async ({ auth, body: { file } }) => {
    if (auth) {
        if (file) {

            const [ id, extension ] = file.name.split(".");
            try {

            } catch(error) {
                set.status = 500;
                return { message: "Algo deu errado" };
            }
        }
    }

    set.status = 401;
    return { message: "Sem token" };
}

export const findById = async (body, set) => {
    const user = await User.findById(body.id);

    set.status = 200;
    return { user };
}

export const findOne = async (body) => {
    const user = await User.findOne(body);
    return user;
}