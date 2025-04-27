import { autoInjectable, singleton } from 'tsyringe';

@autoInjectable()
@singleton()
class FFMPEGServices {}

export { FFMPEGServices };
