const Joi = require("@hapi/joi");

const validatePost = data => {
  const schema = Joi.object({
    title: Joi.string().min(4).max(255).required(),
    body: Joi.string().required()
  });
  return schema.validate(data);
};

module.exports = validatePost;