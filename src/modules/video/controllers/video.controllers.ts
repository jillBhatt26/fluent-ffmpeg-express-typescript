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
            if (!req.uploadFileName || !req.uploadFilePath)
                throw new CustomError('No video uploaded!', 400);

            const duration: number = await this.ffpmegServices.getVideoDuration(
                req.uploadFileName
            );

            res.status(201).json({
                success: true,
                data: {
                    name: req.uploadFileName,
                    duration
                }
            });

            return;
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
            res.status(200).json({ success: true });

            return;
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
            res.status(200).json({ success: true });

            return;
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
            res.status(200).json({ success: true });

            return;
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
            res.status(200).json({ success: true });

            return;
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
