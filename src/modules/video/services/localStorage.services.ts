import fs from 'fs';
import path from 'path';
import { autoInjectable, singleton } from 'tsyringe';
import { CustomError } from '@common/CustomError';
import {
    DOWNLOAD_DIR_PATH,
    UPLOAD_DIR_PATH,
    SUBTITLES_DIR_PATH
} from '@config/constants.config';

@autoInjectable()
@singleton()
class LocalStorageServices {
    saveFileFromBlob = (blob: Blob, videoName: string) =>
        new Promise<boolean>(async (resolve, reject) => {
            const videoPath: string = path.resolve(
                DOWNLOAD_DIR_PATH,
                videoName
            );

            try {
                const arrayBuffer = await blob.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);

                fs.writeFileSync(videoPath, buffer);

                return resolve(true);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    return reject(
                        new CustomError(
                            error.message ??
                                'Failed to download file from cloud',
                            500
                        )
                    );
                }
            }
        });

    generateVideoSRTFile = (videoName: string, subtitleFileContents: string) =>
        new Promise(async (resolve, reject) => {
            const subtitlePath = path.resolve(
                SUBTITLES_DIR_PATH,
                `${videoName.replace(path.extname(videoName), '.srt')}`
            );

            fs.writeFile(subtitlePath, subtitleFileContents, error => {
                if (error)
                    return reject(
                        new CustomError(
                            error.message ?? 'Failed to generate .srt file',
                            500
                        )
                    );

                return resolve(true);
            });
        });

    deleteFile = (filename: string) =>
        new Promise<boolean>((resolve, reject) => {
            const filePath = path.resolve(UPLOAD_DIR_PATH, filename);

            fs.unlink(filePath, error => {
                if (error)
                    return reject(
                        new CustomError(
                            'Failed to delete file from local storage',
                            500
                        )
                    );

                return resolve(true);
            });
        });
}

export { LocalStorageServices };
