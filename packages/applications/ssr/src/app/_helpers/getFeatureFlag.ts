import 'server-only';

export const featureFlag = process.env.FEATURES?.split(',') ?? [];
