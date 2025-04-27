import { Router } from 'express';
import { videoRoutes } from '@modules/video/routes/video.routes';

const appRoutes: Router = Router();

appRoutes.use('/videos', videoRoutes);

export { appRoutes };
