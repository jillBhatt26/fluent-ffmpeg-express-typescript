import path from 'path';

export const UPLOAD_DIR_PATH: string = path.resolve(
    __dirname,
    '../',
    '../',
    'uploads'
);

export const MAX_FILE_SIZE: number = 1024 * 1024 * 15; // 15 MB
