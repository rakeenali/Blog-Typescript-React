import "reflect-metadata";
import { MetaDataKeys, Methods } from "./enums";
import AppRouter from "../router/AppRouter";

export const controller = (prefix: string) => {
  return (target: Function) => {
    const router = AppRouter.getRouter();
    const { prototype } = target;

    for (let key in prototype) {
      const cb = prototype[key];

      const path = Reflect.getMetadata(MetaDataKeys.path, prototype, key);
      const method: Methods = Reflect.getMetadata(
        MetaDataKeys.method,
        prototype,
        key
      );
      const middlewares =
        Reflect.getMetadata(MetaDataKeys.middleware, prototype, key) || [];

      router[method](`${prefix}${path}`, ...middlewares, cb);
    }
  };
};
