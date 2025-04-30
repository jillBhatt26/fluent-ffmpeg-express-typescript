import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { autoInjectable, container, inject, singleton } from 'tsyringe';
import { CustomError } from '@common/CustomError';
import { UPLOAD_DIR_PATH } from '@config/constants.config';
import { CloudStorageServices } from '../services/cloudstorage.services';
import { FFMPEGServices } from '../services/ffmpeg.services';
import { LocalStorageServices } from '../services/localStorage.services';
import { VideoServices } from '../services/video.services';

@autoInjectable()
@singleton()
class VideoControllers {
    constructor(
        @inject(FFMPEGServices) private ffpmegServices: FFMPEGServices,
        @inject(CloudStorageServices)
        private cloudStorageServices: CloudStorageServices,
        @inject(VideoServices) private videoServices: VideoServices,
        @inject(LocalStorageServices)
        private localStorageServices: LocalStorageServices
    ) {}

    upload = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.uploadFileName || !req.uploadFilePath)
                throw new CustomError('No video uploaded!', 400);

            const [duration, size] = await Promise.all([
                this.ffpmegServices.getVideoDuration(req.uploadFileName),
                this.ffpmegServices.getVideoSize(req.uploadFileName)
            ]);

            const uploadVideoData = await this.cloudStorageServices.upload(
                req.uploadFileName
            );

            if (!uploadVideoData || !uploadVideoData.id)
                throw new CustomError('Upload video to cloud failed!', 500);

            const isLocalFileDeleted: boolean =
                await this.localStorageServices.deleteFile(req.uploadFileName);

            if (!isLocalFileDeleted)
                throw new CustomError('Failed to delete local video', 500);

            const video = await this.videoServices.createVideo({
                name: req.uploadFileName,
                duration,
                size,
                cloudID: uploadVideoData.id
            });

            res.status(201).json({
                success: true,
                data: {
                    video
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
            const videoToTrim = await this.videoServices.getVideoByID(
                req.params.id
            );

            if (!videoToTrim)
                throw new CustomError('Requested video not found!', 404);

            // const fileBlob = await this.cloudStorageServices.download(
            //     videoToTrim.name
            // );

            // await this.localStorageServices.saveFileFromBlob(
            //     fileBlob,
            //     videoToTrim.name
            // );

            const videoURL: string =
                await this.cloudStorageServices.fetchSignedUrl(
                    videoToTrim.name
                );

            await this.ffpmegServices.trimVideo(
                videoURL,
                req.body.start,
                parseInt(req.body.duration)
            );

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
