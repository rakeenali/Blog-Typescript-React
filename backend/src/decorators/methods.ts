import "reflect-metadata";
import { RequestHandler } from "express";
import { Methods, MetaDataKeys } from "./enums";

interface RouterDescriptor extends PropertyDescriptor {
  value?: RequestHandler;
}

const routes = (method: Methods) => {
  return (path: string) => {
    return (target: any, key: string) => {
      Reflect.defineMetadata(MetaDataKeys.path, path, target, key);
      Reflect.defineMetadata(MetaDataKeys.method, method, target, key);
    };
  };
};

export const Get = routes(Methods.get);
export const Post = routes(Methods.post);
export const Delete = routes(Methods.delete);
