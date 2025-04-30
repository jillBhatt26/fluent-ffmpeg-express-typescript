import * as yup from 'yup';

const uploadVideoRequestBodySchema = yup.object({}).stripUnknown();

const addSubtitlesRequestBodySchema = yup.object({}).stripUnknown();

const trimVideoRequestBodySchema = yup
    .object({
        start: yup
            .string()
            .trim()
            .required('Start timestamp is required')
            .min(3, 'Start timestamp must be at least 3 characters')
            .max(255, 'Start timestamp must be less than 255 characters')
            .matches(
                /^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/,
                'Invalid start timestamp format. Please use hh:mm:ss.'
            ),
        end: yup
            .string()
            .trim()
            .required('End timestamp is required')
            .min(3, 'End timestamp must be at least 3 characters')
            .max(255, 'End timestamp must be less than 255 characters')
            .matches(
                /^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/,
                'Invalid end timestamp format. Please use hh:mm:ss.'
            )
    })
    .stripUnknown();

export {
    addSubtitlesRequestBodySchema,
    trimVideoRequestBodySchema,
    uploadVideoRequestBodySchema
};
