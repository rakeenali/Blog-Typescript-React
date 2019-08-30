import { Request } from "express";

export interface RegisterRequest extends Request {
  body: {
    password: string;
    username: string;
    name: string;
  };
}

export interface LoginRequest extends Request {
  body: {
    password: string;
    username: string;
  };
}

export interface AuthenticatedRequest extends Request {
  user: {
    username: string;
    id: number;
  };
}

export interface ProfileRequest extends Request, AuthenticatedRequest {
  body: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export interface BlogRequest extends AuthenticatedRequest {
  body: {
    title: string;
    description: string;
  };
}

export interface ManyBlogResponse {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  author: {
    id: number;
    name: string;
    username: string;
    avatar: string;
  };
}

export interface BlogToJson {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  author: {
    id: number;
    name: string;
    username: string;
    avatar: string;
  };
}

export interface Blog {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

export interface UserToJson {
  userId: number;
  name: string;
  username: string;
  usersProfile: string | null;
  profile?: {
    profileId: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
  blogs: Blog[];
}
