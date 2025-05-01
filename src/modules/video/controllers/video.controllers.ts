import { Request, Response, NextFunction } from 'express';
import { autoInjectable, container, inject, singleton } from 'tsyringe';
import { CustomError } from '@common/CustomError';
import { CloudStorageServices } from '../services/cloudstorage.services';
import { FFMPEGServices } from '../services/ffmpeg.services';
import { LocalStorageServices } from '../services/localStorage.services';
import { VideoServices } from '../services/video.services';
import { getSecondsFromTS } from '../utils/getSecondsFromTS';
import { SubtitlesService } from '../services/subtitles.service';

@autoInjectable()
@singleton()
class VideoControllers {
    constructor(
        @inject(FFMPEGServices) private ffpmegServices: FFMPEGServices,
        @inject(CloudStorageServices)
        private cloudStorageServices: CloudStorageServices,
        @inject(VideoServices) private videoServices: VideoServices,
        @inject(LocalStorageServices)
        private localStorageServices: LocalStorageServices,
        @inject(SubtitlesService) private subtitleService: SubtitlesService
    ) {}

    upload = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.uploadFileName || !req.uploadFilePath)
                throw new CustomError('No video uploaded!', 400);

            const { duration, size } =
                await this.ffpmegServices.getVideoMetaData(req.uploadFileName);

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

            const videoURL: string =
                await this.cloudStorageServices.fetchSignedUrl(
                    videoToTrim.name
                );

            const startSec = getSecondsFromTS(req.body.start);
            const endSec = getSecondsFromTS(req.body.end);

            if (endSec <= startSec)
                throw new CustomError(
                    'Improper start and end timestamps provided',
                    400
                );

            const isVideoTrimmed: boolean = await this.ffpmegServices.trimVideo(
                videoURL,
                videoToTrim.name,
                req.body.start,
                endSec - startSec
            );

            if (!isVideoTrimmed)
                throw new CustomError('Failed to trim the video', 500);

            const trimmedVideoUploadData =
                await this.cloudStorageServices.upload(videoToTrim.name, true);

            if (!trimmedVideoUploadData)
                throw new CustomError('Failed to trim video', 500);

            const { duration, size } =
                await this.ffpmegServices.getVideoMetaData(videoToTrim.name);

            const updatedVideo = await this.videoServices.updateVideoData(
                videoToTrim.id,
                {
                    duration,
                    size,
                    cloudID: trimmedVideoUploadData.id,
                    status: 'PROCESSING'
                }
            );

            await this.localStorageServices.deleteFile(videoToTrim.name);

            res.status(200).json({
                success: isVideoTrimmed,
                data: {
                    video: updatedVideo
                }
            });

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
            const video = await this.videoServices.getVideoByID(req.params.id);

            if (!video)
                throw new CustomError('Video to add subtitles not found!', 404);

            const subtitlesContent =
                this.subtitleService.generateSubtitleFileContent(
                    req.body.subtitles
                );

            const isSRTGenerated =
                await this.localStorageServices.generateVideoSRTFile(
                    video.name,
                    subtitlesContent
                );

            if (!isSRTGenerated)
                throw new CustomError(
                    'Failed to generate video subtitles',
                    500
                );

            const videoURL = await this.cloudStorageServices.fetchSignedUrl(
                video.name
            );

            console.log('1...');

            const areSubtitlesApplied =
                await this.ffpmegServices.addSubtitlesToVideo(
                    videoURL,
                    video.name
                );
            console.log('2...');

            res.status(200).json({ success: areSubtitlesApplied });

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
            await this.videoServices.updateVideoStatus(
                req.params.id,
                'COMPLETED'
            );

            res.status(200).json({
                success: true
            });

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
            const videoToDownload = await this.videoServices.getVideoByID(
                req.params.id
            );

            if (!videoToDownload)
                throw new CustomError('Video to download not found!', 404);

            if (videoToDownload.status !== 'COMPLETED')
                throw new CustomError('Incomplete video render status.', 400);

            const videoBlob = await this.cloudStorageServices.download(
                videoToDownload.name
            );

            const isVideoDownloaded =
                await this.localStorageServices.saveFileFromBlob(
                    videoBlob,
                    videoToDownload.name
                );

            if (!isVideoDownloaded)
                throw new CustomError('Download video failed!', 500);

            res.status(200).json({
                success: true
            });

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
