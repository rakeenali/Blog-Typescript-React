import { Model, DataTypes, BuildOptions } from "sequelize";
import db from "../db";

export interface ProfileModel extends Model {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly avatar?: string;
}

export type ProfileModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): ProfileModel;
};

export const Profile = <ProfileModelStatic>db.define(
  "Profile",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING
    }
  },
  {
    timestamps: false,
    modelName: "Profile",
    tableName: "Profile"
  }
);
