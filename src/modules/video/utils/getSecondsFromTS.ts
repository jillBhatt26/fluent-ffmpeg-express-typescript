const getSecondsFromTS = (timestampString: string): number => {
    const [hours, mins, secs] = timestampString.split(':');

    return parseInt(hours) * 3600 + parseInt(mins) * 60 + parseInt(secs);
};

export { getSecondsFromTS };
