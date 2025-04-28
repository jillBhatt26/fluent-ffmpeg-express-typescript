import { CustomError } from '@common/CustomError';
import { UPLOAD_DIR_PATH } from '@config/constants.config';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { path as ffprobePath } from '@ffprobe-installer/ffprobe';
import { autoInjectable, singleton } from 'tsyringe';

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
}

export { FFMPEGServices };
