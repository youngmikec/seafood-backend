import Joi from 'joi';

export const validateCoordinate = Joi.object({
    address: Joi.string().optional(),
    coordinate: Joi.array().items(Joi.number()).optional(),
    direction: Joi.string().valid("forward", "reverse").required(),
    createdBy: Joi.string().optional(),
});