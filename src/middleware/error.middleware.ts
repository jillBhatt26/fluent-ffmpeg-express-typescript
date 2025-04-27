import { NextFunction, Request, Response } from 'express';
import { CustomError } from '@common/CustomError';

const errorMiddleware = async (
    error: Error,
    _: Request,
    res: Response,
    __: NextFunction
) => {
    if (error instanceof CustomError) {
        return res.status(error.code).json({
            success: false,
            message: error.message
        });
    }

    return res.status(500).json({
        success: false,
        message: error.message ?? 'Unexpected execution failure occurred!'
    });
};

export { errorMiddleware };
