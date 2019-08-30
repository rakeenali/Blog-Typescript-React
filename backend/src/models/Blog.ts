import {
  Model,
  BuildOptions,
  DataTypes,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  BelongsToCreateAssociationMixin
} from "sequelize";
import db from "../db";
import { User, UserModel } from "./User";

export interface BlogModel extends Model {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly createdAt: Date;
  readonly author: number;

  readonly getAuthor: BelongsToGetAssociationMixin<UserModel>;
  readonly setAuthor: BelongsToSetAssociationMixin<UserModel, number>;
  readonly createAuthor: BelongsToCreateAssociationMixin<UserModel>;
}

type BlogStaticModel = typeof Model & {
  new (values?: object, options?: BuildOptions): BlogModel;
};

export const Blog = <BlogStaticModel>db.define(
  "Blog",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    author: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id"
      }
    }
  },
  {
    timestamps: false,
    modelName: "Blog",
    tableName: "Blog"
  }
);
