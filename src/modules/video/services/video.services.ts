import { autoInjectable, singleton } from 'tsyringe';

@autoInjectable()
@singleton()
class VideoServices {}

export { VideoServices };
