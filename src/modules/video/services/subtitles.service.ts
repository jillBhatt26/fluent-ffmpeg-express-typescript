import { autoInjectable, singleton } from 'tsyringe';
import { ISubtitlesInput } from '../interfaces/videos.interfaces';

@autoInjectable()
@singleton()
class SubtitlesService {
    private padZeroesToValue = (value: number, length: number = 2): string => {
        return value.toString().padStart(length, '0');
    };

    private formatTimestampString = (timestamp: string) => {
        const [hours, minutes, seconds] = timestamp.split(':').map(Number);

        // NOTE: Don't take milliseconds input and assign hardcoded value only
        const milliseconds = 0;

        return `${this.padZeroesToValue(hours)}:${this.padZeroesToValue(
            minutes
        )}:${this.padZeroesToValue(seconds)},${this.padZeroesToValue(
            milliseconds,
            3
        )}`;
    };

    generateSubtitleFileContent = (
        subtitlesInputs: ISubtitlesInput[]
    ): string => {
        const subtitlesFileContent = subtitlesInputs
            .map(subtitle => ({
                ...subtitle,
                start: this.formatTimestampString(subtitle.start),
                end: this.formatTimestampString(subtitle.end)
            }))
            .reduce((op, subtitle, index) => {
                op += `${index + 1}\n${subtitle.start} --> ${subtitle.end}\n${
                    subtitle.text
                }\n\n`;

                return op;
            }, '');

        return subtitlesFileContent;
    };
}

export { SubtitlesService };
