import fs from 'fs';
import path from 'path';
import { autoInjectable, singleton } from 'tsyringe';
import { CustomError } from '@common/CustomError';
import { UPLOAD_DIR_PATH, SIGNED_URL_TIMEOUT } from '@config/constants.config';
import { NODE_ENV } from '@config/env.config';
import { supabase } from '@config/supabase.config';

@autoInjectable()
@singleton()
class CloudStorageServices {
    constructor(
        private bucketName: string = NODE_ENV === 'production'
            ? 'videos-prod'
            : 'videos-dev'
    ) {}

    getFile = (videoName: string) =>
        new Promise<File>(async (resolve, reject) => {
            try {
                const chunks = [];

                const videoPath = path.resolve(UPLOAD_DIR_PATH, videoName);

                const readStream = fs.createReadStream(videoPath);

                for await (const chunk of readStream) {
                    chunks.push(chunk);
                }

                let fileExtension = path.extname(videoName);

                if (fileExtension === 'mov') fileExtension = 'quicktime';

                const file: File = new File(chunks, videoName, {
                    type: `video/${fileExtension}`
                });

                return resolve(file);
            } catch (error) {
                if (error instanceof CustomError) return reject(error);

                return reject(
                    new CustomError('Failed to read the file to upload!', 500)
                );
            }
        });

    upload = (videoName: string) =>
        new Promise<{
            id: string;
            path: string;
            fullPath: string;
        } | null>(async (resolve, reject) => {
            try {
                const file = await this.getFile(videoName);

                const { data, error } = await supabase.storage
                    .from(this.bucketName)
                    .upload(videoName, file);

                if (error) {
                    throw new CustomError(
                        error.message ?? 'File upload failed!',
                        500
                    );
                }

                resolve(data);
            } catch (error) {
                if (error instanceof CustomError) return reject(error);

                return reject(new CustomError('File upload failed!', 500));
            }
        });

    fetch = (videoName: string, signedUrlTimeout = SIGNED_URL_TIMEOUT) =>
        new Promise(async (resolve, reject) => {
            try {
                const { data, error } = await supabase.storage
                    .from(this.bucketName)
                    .createSignedUrl(videoName, signedUrlTimeout);

                if (error)
                    throw new CustomError(
                        error.message ?? 'File fetch failed!',
                        500
                    );

                return resolve(data);
            } catch (error) {
                if (error instanceof CustomError) return reject(error);

                return reject(new CustomError('File fetch failed!', 500));
            }
        });
}

export { CloudStorageServices };
