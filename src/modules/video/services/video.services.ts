import { CustomError } from '@common/CustomError';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { autoInjectable, singleton } from 'tsyringe';
import { VideoModel, Video } from '@db';

@autoInjectable()
@singleton()
class VideoServices {
    getVideoByID = async (id: string): Promise<Video | null> => {
        try {
            const video: Video | null = await VideoModel.findUnique({
                where: {
                    id
                }
            });

            return video;
        } catch (error: unknown) {
            if (error instanceof PrismaClientKnownRequestError)
                throw new CustomError(
                    error.message ?? 'Failed to fetch requested video',
                    500
                );

            throw new CustomError('Fetch video query failed', 500);
        }
    };

    createVideo = async (
        createVideoInputs: Prisma.VideoCreateInput
    ): Promise<Video> => {
        try {
            const video: Video = await VideoModel.create({
                data: createVideoInputs
            });

            return video;
        } catch (error: unknown) {
            if (error instanceof PrismaClientKnownRequestError)
                throw new CustomError(
                    error.message ?? 'Failed to fetch requested video',
                    500
                );

            throw new CustomError('Fetch video query failed', 500);
        }
    };
}

export { VideoServices };
