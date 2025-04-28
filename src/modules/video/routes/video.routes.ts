import { Router } from 'express';
import { multerStorage } from '@config/multer.config';
import { videoControllers } from '../controllers/video.controllers';

const videoRoutes = Router();

videoRoutes.post(
    '/upload',
    multerStorage.single('video'),
    videoControllers.upload
);
videoRoutes.post('/:id/trim', videoControllers.trim);
videoRoutes.post('/:id/download', videoControllers.download);
videoRoutes.post('/:id/subtitles', videoControllers.addSubtitles);
videoRoutes.post('/:id/render', videoControllers.render);

export { videoRoutes };
