import "reflect-metadata";
import { MetaDataKeys } from "./enums";

export const use = (middleware: any) => {
  return (target: any, key: string) => {
    const middlewares =
      Reflect.getMetadata(MetaDataKeys.middleware, target, key) || [];
    middlewares.unshift(middleware);

    Reflect.defineMetadata(MetaDataKeys.middleware, middlewares, target, key);
  };
};
