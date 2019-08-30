import express from "express";

export default class AppRouter {
  static instance: express.Router;

  static getRouter(): express.Router {
    if (!AppRouter.instance) {
      AppRouter.instance = express.Router();
    }

    return AppRouter.instance;
  }
}
