
import { Elysia } from "elysia";
import { cookie } from "@elysiajs/cookie";
import { jwt } from "@elysiajs/jwt";
import mongoose from "mongoose";
import * as User from "./src/controllers/User";
import * as Language from "./src/controllers/Language";
import * as Chat from "./src/controllers/Chat";
import * as Message from "./src/controllers/Message";
import { eventListener } from "./src/services/eventListener";

await mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.warn("Connected to database");
    })
    .catch((error) => {
        console.error(error.message);
    })

const app = new Elysia();

//middlewares
app.use(jwt({ name: 'jwt', secret: process.env.SECRET }));
app.use(cookie());

//auth routes
const routes = ["sign-up", "sign-in"]
app.derive(async ({ request, cookie, jwt, set }) => {
    const auth = await jwt.verify(cookie.auth);
    console.log(auth)
    
    const route = request.url.split("/").slice(-1)[0];
    if (routes.includes(route)) {
        return {};
    }
    
    if (auth) {
        return { auth };
    }
    return;
});

//websocket
app.ws("/", {
    async open(ws) {
        console.log("connected", ws.id);
    },
    async message(ws, message) {
        console.log("message received")
        eventListener(message, ws);
        ws.send(message);
    },
    async close(ws) {
       console.log("disconnected", ws.id);
    }
});

//language routes
app.group("/language", app => app
    .post("/new", Language.create)
    .get("/all", Language.findAll)
);

//user routes
app.group("/user", app => app
    .post("/sign-up", User.create)
    .post("/sign-in", User.signIn)
    .get("/find-all", User.findAll)
    .post("/update-status", User.setBiography)
    .post("/update-languages", User.setLanguages)
    .post("/update-image", User.setImage)
    .get("/followers", User.getFollowers)
    .get("/feed", User.getFeed)
    .get("/sign-out", User.signOut)
    .post("/find", User.findById)
);
   
//chat routes
app.group("chat", app => app 
    .post("/new", Chat.create)
    .get("/all", Chat.findAllByUser)
    .post("/send", Message.create)
    .post("/messages", Message.findByChat)
);
    
//server connection
app.listen(5000);



