import 'server-only';

export const featureFlag = (process.env.FEATURES?.split(',') ?? []).map((flag) => flag.trim());
export const isFeatureEnabled = (flag: string) => featureFlag.includes(flag);
