import Joi from "@hapi/joi";

export const registerValidation = Joi.object().keys({
  name: Joi.string()
    .min(3)
    .required(),
  username: Joi.string()
    .min(4)
    .max(12)
    .required(),
  password: Joi.string()
    .min(3)
    .max(12)
    .required()
});

export const loginValidation = Joi.object().keys({
  username: Joi.string()
    .min(4)
    .max(12)
    .required(),
  password: Joi.string()
    .min(3)
    .max(12)
    .required()
});

export const profileValidation = Joi.object().keys({
  firstName: Joi.string()
    .min(4)
    .max(12)
    .required(),
  lastName: Joi.string()
    .min(3)
    .max(12)
    .required(),
  avatar: Joi.string().uri()
});
export const blogValidation = Joi.object().keys({
  title: Joi.string()
    .min(4)
    .max(100)
    .required(),
  description: Joi.string()
    .min(4)
    .required()
});
