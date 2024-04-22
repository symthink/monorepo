import { buildInfo } from './env';

export const ENV = {
    version: buildInfo.version,
    timestamp: buildInfo.timestamp,
};
