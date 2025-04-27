import { Request, Response, NextFunction } from 'express';
import { autoInjectable, container, inject, singleton } from 'tsyringe';
import { FFMPEGServices } from '../services/ffmpeg.services';
import { VideoServices } from '../services/video.services';

@autoInjectable()
@singleton()
class VideoControllers {
    constructor(
        @inject(FFMPEGServices) private ffpmegServices: FFMPEGServices,
        @inject(VideoServices) private videoServices: VideoServices
    ) {}

    upload = async (req: Request, res: Response, next: NextFunction) => {};

    trim = async (req: Request, res: Response, next: NextFunction) => {};

    addSubtitles = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {};

    render = async (req: Request, res: Response, next: NextFunction) => {};

    download = async (req: Request, res: Response, next: NextFunction) => {};
}

const videoControllers = container.resolve<VideoControllers>(VideoControllers);

export { videoControllers };
