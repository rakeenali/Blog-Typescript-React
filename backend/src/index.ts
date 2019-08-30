import "./config/config";
import "./models/User";
import "./models/Profile";
import "./models/Blog";
import db from "./db";
import express from "express";
import AppRouter from "./router/AppRouter";
import cors from "cors";

import "./controllers/Auth.contoller";
import "./controllers/Profile.contoller";
import "./controllers/Blog.controller";

const app = express();
app.use(cors());
app.use(express.json());

const router = AppRouter.getRouter();

app.use(router);

db.sync().then(() => {
  app.listen(5000, () => {
    console.log("Server started on port 5000");
    console.log("DB Connected");
  });
});
