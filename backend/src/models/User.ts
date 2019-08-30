import {
  Model,
  DataTypes,
  BuildOptions,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManySetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyRemoveAssociationMixin,
  HasManyCreateAssociationMixin
} from "sequelize";
import db from "../db";

import { ProfileModel, Profile } from "./Profile";
import { Blog, BlogModel } from "./Blog";

export interface UserModel extends Model {
  readonly id: number;
  readonly name: string;
  readonly username: string;
  readonly password: string;
  readonly usersProfile: number | null;

  readonly getProfile: BelongsToGetAssociationMixin<ProfileModel>;
  readonly setProfile: BelongsToSetAssociationMixin<ProfileModel, number>;
  readonly createProfile: BelongsToCreateAssociationMixin<ProfileModel>;

  readonly getBlog: HasManyGetAssociationsMixin<BlogModel>;
  readonly countBlog: HasManyCountAssociationsMixin;
  readonly hasBlog: HasManyHasAssociationMixin<BlogModel, number>;
  readonly setBlog: HasManySetAssociationsMixin<BlogModel, number>;
  readonly addBlog: HasManyAddAssociationMixin<BlogModel, number>;
  readonly removeBlog: HasManyRemoveAssociationMixin<BlogModel, number>;
  readonly createBlog: HasManyCreateAssociationMixin<BlogModel>;
}

export type UserModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): UserModel;
};

export const User = <UserModelStatic>db.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    usersProfile: {
      type: DataTypes.INTEGER,
      references: {
        model: Profile,
        key: "id"
      }
    }
  },
  {
    timestamps: false,
    modelName: "User",
    tableName: "User"
  }
);

User.belongsTo(Profile, {
  as: "Profile",
  foreignKey: "usersProfile",
  targetKey: "id"
});

User.hasMany(Blog, {
  as: "Blog",
  foreignKey: "author",
  sourceKey: "id"
});

Blog.belongsTo(User, {
  as: "Author",
  foreignKey: "author",
  targetKey: "id"
});
