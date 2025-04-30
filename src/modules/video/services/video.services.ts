import { CustomError } from '@common/CustomError';
import { Prisma, VideoStatus } from '@prisma/client';
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

    updateVideoStatus = async (
        videoID: string,
        status: VideoStatus
    ): Promise<boolean> => {
        try {
            const videoToUpdate = await this.getVideoByID(videoID);

            if (!videoToUpdate) throw new CustomError('Video not found!', 404);

            await VideoModel.update({
                where: {
                    id: videoID
                },
                data: {
                    status
                }
            });

            return true;
        } catch (error: unknown) {
            if (error instanceof CustomError) throw error;

            if (error instanceof PrismaClientKnownRequestError)
                throw new CustomError(
                    error.message ?? 'Failed to fetch requested video',
                    500
                );

            throw new CustomError('Fetch video query failed', 500);
        }
    };

    updateVideoData = async (
        videoID: string,
        data: Prisma.VideoUpdateInput
    ): Promise<Video> => {
        try {
            const videoToUpdate = await this.getVideoByID(videoID);

            if (!videoToUpdate) throw new CustomError('Video not found!', 404);

            const updatedVideo = await VideoModel.update({
                where: {
                    id: videoID
                },
                data,
                select: {
                    id: true,
                    cloudID: true,
                    createdAt: true,
                    duration: true,
                    name: true,
                    size: true,
                    status: true,
                    updatedAt: true
                }
            });

            return updatedVideo;
        } catch (error: unknown) {
            if (error instanceof CustomError) throw error;

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
