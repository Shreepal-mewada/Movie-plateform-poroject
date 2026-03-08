const Joi = require('joi');

const signupSchema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
        'string.empty': 'Name cannot be an empty field',
        'any.required': 'Name is a required field',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is a required field',
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is a required field',
    }),
    adminSecret: Joi.string().optional(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is a required field',
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is a required field',
    }),
});

// Middleware to validate request body
const validate = (schema) => (req, res, next) => {
    // default to empty object if body is missing so Joi catches missing fields
    req.body = req.body || {};
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        res.status(400);
        throw new Error(errorMessages.join(', '));
    }
    next();
};

module.exports = {
    signupSchema,
    loginSchema,
    validate,
};
