import { Request, Response, NextFunction } from 'express';
import { autoInjectable, container, inject, singleton } from 'tsyringe';
import { CustomError } from '@common/CustomError';
import { FFMPEGServices } from '../services/ffmpeg.services';
import { VideoServices } from '../services/video.services';

@autoInjectable()
@singleton()
class VideoControllers {
    constructor(
        @inject(FFMPEGServices) private ffpmegServices: FFMPEGServices,
        @inject(VideoServices) private videoServices: VideoServices
    ) {}

    upload = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.status(200).json({ success: true });
        } catch (error: unknown) {
            if (error instanceof CustomError) return next(error);

            return next(
                new CustomError(
                    'Something went wrong while uploading video!',
                    500
                )
            );
        }
    };

    trim = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.status(200).json({ success: true });
        } catch (error: unknown) {
            if (error instanceof CustomError) return next(error);

            return next(
                new CustomError(
                    'Something went wrong while trimming video!',
                    500
                )
            );
        }
    };

    addSubtitles = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.status(200).json({ success: true });
        } catch (error: unknown) {
            if (error instanceof CustomError) return next(error);

            return next(
                new CustomError(
                    'Something went wrong while adding subtitles to video!',
                    500
                )
            );
        }
    };

    render = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.status(200).json({ success: true });
        } catch (error: unknown) {
            if (error instanceof CustomError) return next(error);

            return next(
                new CustomError(
                    'Something went wrong while rendering video!',
                    500
                )
            );
        }
    };

    download = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return res.status(200).json({ success: true });
        } catch (error: unknown) {
            if (error instanceof CustomError) return next(error);

            return next(
                new CustomError(
                    'Something went wrong while downloading video!',
                    500
                )
            );
        }
    };
}

const videoControllers = container.resolve<VideoControllers>(VideoControllers);

export { videoControllers };
