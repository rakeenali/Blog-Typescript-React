import {
  CurrentUserResponse as CurrentUserState,
  Profile
} from "../types/inteface";
import faker from "faker";

function getUser(overrides?: any): CurrentUserState {
  return {
    userId: faker.random.number({ min: 1, max: 5 }),
    name: faker.name.findName(),
    username: faker.internet.userName(),
    usersProfile: null,
    profile: null,
    blogs: [],
    ...overrides
  };
}

function getProfile(overrides?: any): Profile {
  return {
    profileId: faker.random.number({ min: 1, max: 5 }).toString(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    avatar: faker.internet.avatar(),
    ...overrides
  };
}

export { getUser, getProfile };
