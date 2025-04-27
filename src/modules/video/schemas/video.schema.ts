import * as yup from 'yup';

const uploadVideoRequestBodySchema = yup.object({}).stripUnknown();

const addSubtitlesRequestBodySchema = yup.object({}).stripUnknown();

const trimVideoRequestBodySchema = yup.object({}).stripUnknown();

export {
    addSubtitlesRequestBodySchema,
    trimVideoRequestBodySchema,
    uploadVideoRequestBodySchema
};
