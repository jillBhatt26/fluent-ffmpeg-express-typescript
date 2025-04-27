import { Router } from 'express';
import { videoControllers } from '../controllers/video.controllers';
import { videoRequestsValidations } from '../validations/video.validations';

const videoRoutes = Router();

videoRoutes.post(
    '/upload',
    videoRequestsValidations.upload,
    videoControllers.upload
);
videoRoutes.post('/:id/trim', videoControllers.trim);
videoRoutes.post('/:id/download', videoControllers.download);
videoRoutes.post('/:id/subtitles', videoControllers.addSubtitles);
videoRoutes.post('/:id/render', videoControllers.render);

export { videoRoutes };
