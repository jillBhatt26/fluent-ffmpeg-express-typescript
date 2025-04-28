import { Request } from 'express';
import multer, { StorageEngine, FileFilterCallback, Multer } from 'multer';
import { nanoid } from 'nanoid';
import path from 'path';
import { CustomError } from '@common/CustomError';
import { MAX_FILE_SIZE, UPLOAD_DIR_PATH } from './constants.config';

const storage: StorageEngine = multer.diskStorage({
    destination: UPLOAD_DIR_PATH,
    filename: function (req: Request, file: Express.Multer.File, cb) {
        const fileName = nanoid();

        const fileExtName: string = path.extname(file.originalname);

        const uploadFileName = `${fileName}${fileExtName}`;

        req.uploadFilePath = path.resolve(UPLOAD_DIR_PATH, uploadFileName);
        req.uploadFileName = uploadFileName;

        cb(null, uploadFileName);
    }
});

const checkFileType = (file: Express.Multer.File, cb: FileFilterCallback) => {
    // Allowed types regex
    const fileTypes = /mp4|mov/;

    // check the extensions
    const extName: boolean = fileTypes.test(
        path.extname(file.originalname).toLowerCase()
    );

    // check mime type
    const mimeType = fileTypes.test(file.mimetype);

    if (mimeType && extName) {
        return cb(null, true);
    } else {
        cb(new CustomError('Only video files are allowed', 400));
    }
};

const multerStorage: Multer = multer({
    storage: storage,
    limits: {
        fileSize: MAX_FILE_SIZE
    },
    fileFilter: function (
        _: Request,
        file: Express.Multer.File,
        cb: FileFilterCallback
    ) {
        checkFileType(file, cb);
    }
});

export { multerStorage };
