
import { Elysia } from "elysia";
import * as nanoid from "nanoid";

const baseDir = "./";

const app = new Elysia()
  .post("/upload", async ({body: { file }}) => {
   
    await Bun.write(Bun.file(`${baseDir}${nanoid.nanoid()}.png`), file);
    
  })
  .listen(3000);