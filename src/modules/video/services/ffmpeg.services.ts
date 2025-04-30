import fs from 'fs';
import path from 'path';
import { path as ffprobePath } from '@ffprobe-installer/ffprobe';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import { autoInjectable, singleton } from 'tsyringe';
import { CustomError } from '@common/CustomError';
import { UPLOAD_DIR_PATH } from '@config/constants.config';

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

@autoInjectable()
@singleton()
class FFMPEGServices {
    getVideoDuration = (videoName: string) =>
        new Promise<number>((resolve, reject) => {
            const videoPath: string = path.resolve(UPLOAD_DIR_PATH, videoName);

            ffmpeg.ffprobe(videoPath, (error: unknown, metadata) => {
                if (error instanceof Error)
                    return reject(
                        new CustomError(
                            error.message ?? 'Failed to fetch video duration',
                            500
                        )
                    );

                if (!metadata.format.duration)
                    return reject(
                        new CustomError(
                            'Failed to parse video duration information',
                            500
                        )
                    );

                return resolve(metadata.format.duration);
            });
        });

    getVideoSize = (videoName: string) =>
        new Promise<number>((resolve, reject) => {
            const videoPath: string = path.resolve(UPLOAD_DIR_PATH, videoName);

            fs.stat(videoPath, (error, stats) => {
                if (error) {
                    return reject(
                        new CustomError(
                            error.message ?? 'Error getting video size.',
                            500
                        )
                    );
                }

                return resolve(stats.size);
            });
        });

    trimVideo = (
        videoURL: string,
        videoName: string,
        start: string,
        duration: number
    ) =>
        new Promise<boolean>(async (resolve, reject) => {
            const outputVideoPath: string = path.resolve(
                UPLOAD_DIR_PATH,
                videoName
            );

            ffmpeg(videoURL)
                .setStartTime(start)
                .setDuration(duration)
                .output(outputVideoPath)
                .videoCodec('copy')
                .audioCodec('copy')
                .on('end', () => {
                    return resolve(true);
                })
                .on('error', error => {
                    if (error instanceof Error)
                        return reject(
                            new CustomError(
                                error.message ?? 'Video trim failed',
                                500
                            )
                        );
                })
                .run();
        });

    getVideoMetaData = (videoName: string) =>
        new Promise<{ duration: number; size: number }>(
            async (resolve, reject) => {
                const videoPath: string = path.resolve(
                    UPLOAD_DIR_PATH,
                    videoName
                );

                try {
                    const [duration, size] = await Promise.all([
                        this.getVideoDuration(videoPath),
                        this.getVideoSize(videoPath)
                    ]);

                    return resolve({
                        duration,
                        size
                    });
                } catch (error: unknown) {
                    if (error instanceof CustomError) return reject(error);

                    return reject(
                        new CustomError('Failed to fetch video metadata', 500)
                    );
                }
            }
        );
}

export { FFMPEGServices };
