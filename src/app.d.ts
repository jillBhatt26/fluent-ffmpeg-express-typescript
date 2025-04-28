import 'express';

declare global {
    namespace Express {
        interface Request {
            uploadFilePath?: string;
            uploadFileName?: string;
        }
    }
}
