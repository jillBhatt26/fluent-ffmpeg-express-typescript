import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';
import { ValidationError } from 'yup';
import { CustomError } from '@common/CustomError';
import {
    addSubtitlesRequestBodySchema,
    trimVideoRequestBodySchema,
    uploadVideoRequestBodySchema
} from '../schemas/video.schema';

class VideoRequestsValidations {
    upload = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await uploadVideoRequestBodySchema.validate(req.body);

            return next();
        } catch (error: unknown) {
            if (error instanceof ValidationError)
                return next(new CustomError(error.message, 400));

            if (error instanceof CustomError) return next(error);

            return next(
                new CustomError('Upload video inputs validation failure!', 500)
            );
        }
    };

    trim = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await trimVideoRequestBodySchema.validate(req.body);

            return next();
        } catch (error: unknown) {
            if (error instanceof ValidationError)
                return next(new CustomError(error.message, 400));

            if (error instanceof CustomError) return next(error);

            return next(
                new CustomError('Trim video input validation failure!', 500)
            );
        }
    };
}

const videoRequestsValidations = container.resolve<VideoRequestsValidations>(
    VideoRequestsValidations
);

export { videoRequestsValidations };
