import { Prisma, PrismaClient, Video } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prismaClient = new PrismaClient().$extends(withAccelerate());

const VideoModel = prismaClient.video;

export { prismaClient, Video, VideoModel };
