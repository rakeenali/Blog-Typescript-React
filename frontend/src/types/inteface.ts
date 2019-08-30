export interface Blog {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

export interface Profile {
  profileId: string;
  firstName: string;
  lastName: string;
  avatar: string;
}

export interface CurrentUserResponse {
  userId: number | null;
  name: string | null;
  username: string | null;
  usersProfile: string | null;
  profile: {
    profileId: string;
    firstName: string;
    lastName: string;
    avatar: string;
  } | null;
  blogs: Blog[];
}

export interface SubmitProfile {
  firstName: string;
  lastName: string;
  avatar: string;
}

export interface DetailBlog {
  author: {
    avatar: string;
    id: number;
    name: string;
    username: string;
  };
  createdAt: string;
  description: string;
  id: number;
  title: string;
}
