const Joi = require("@hapi/joi");

const validateChange = data => {
  const schema = Joi.object({
    login: Joi.string().min(4).max(255).email().required(),
    password: Joi.string().required(),
    newPassword: Joi.string().required()
  });
  return schema.validate(data);
};

module.exports = validateChange;