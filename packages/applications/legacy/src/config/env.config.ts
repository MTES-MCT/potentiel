import dotenv from 'dotenv';
dotenv.config();

if (
  !['test', 'development', 'staging', 'production', 'local'].includes(
    process.env.APPLICATION_STAGE || '',
  )
) {
  console.error('ERROR: APPLICATION_STAGE not recognized');
  process.exit(1);
}

export const isTestEnv = process.env.APPLICATION_STAGE === 'test';
export const isLocalEnv = process.env.APPLICATION_STAGE === 'local';
export const isDevEnv = process.env.APPLICATION_STAGE === 'development';
export const isStagingEnv = process.env.APPLICATION_STAGE === 'staging';
export const isProdEnv = process.env.APPLICATION_STAGE === 'production';

console.log(
  'Environment is ' +
    (isTestEnv
      ? 'Test'
      : isLocalEnv
        ? 'Local'
        : isDevEnv
          ? 'Dev'
          : isStagingEnv
            ? 'Staging'
            : isProdEnv
              ? 'Production'
              : 'Not recognized'),
);
