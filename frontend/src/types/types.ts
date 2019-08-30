import { AxiosError, AxiosResponse } from "axios";
import { DetailBlog } from "./inteface";

export type ErrorResponse = AxiosError<{
  error: string;
}>;

export type LoginResponse = AxiosResponse<{ token: string }>;

export type OKResponse = AxiosResponse<{ message: string }>;

export type DetailBlogResponse = AxiosResponse<DetailBlog>;

export type BlogResponse = AxiosResponse<{
  author: number;
  createdAt: string;
  description: string;
  id: number;
  title: string;
}>;

export type Dispatch<T> = (action: T) => void;

export type ContextProps = { children: React.ReactNode };
