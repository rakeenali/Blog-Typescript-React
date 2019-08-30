import { UserToJson } from "../interface";

export const userToJson = (user: any, blogs: any[]): UserToJson => {
  const result =
    blogs.length <= 0
      ? []
      : blogs.map(blog => {
          return {
            id: blog.id,
            title: blog.title,
            description: blog.description,
            createdAt: blog.createdAt
          };
        });

  let userProfile = undefined;
  if (user.Profile) {
    userProfile = {
      profileId: user.Profile.id,
      firstName: user.Profile.firstName,
      lastName: user.Profile.lastName,
      avatar: user.Profile.avatar
    };
  }

  return {
    userId: user.id,
    name: user.name,
    username: user.username,
    usersProfile: user.usersProfile || null,
    // profile: {
    //   profileId: user.Profile.id,
    //   firstName: user.Profile.firstName,
    //   lastName: user.Profile.lastName,
    //   avatar: user.Profile.avatar
    // },
    profile: userProfile,
    blogs: result
  };
};
