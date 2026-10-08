import 'server-only';

const featureFlag = (process.env.FEATURES?.split(',') ?? []).map((flag) => flag.trim());

export const isFeatureEnabled = (flag: string) => featureFlag.includes(flag);
