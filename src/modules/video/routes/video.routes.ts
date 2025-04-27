import { Router } from 'express';
import { videoControllers } from '../controllers/video.controllers';
import { videoRequestsValidations } from '../validations/video.validations';

const videoRoutes = Router();

videoRoutes.post(
    '/upload',
    videoRequestsValidations.upload,
    videoControllers.upload
);
videoRoutes.post('/trim', videoControllers.trim);
videoRoutes.post('/download', videoControllers.download);
videoRoutes.post('/subtitles', videoControllers.addSubtitles);
videoRoutes.post('/render', videoControllers.render);

export { videoRoutes };
