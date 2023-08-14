import { makeServer } from './server';

// Check env variables

const mandatoryVariables = ['APPLICATION_STAGE', 'BASE_URL', 'SEND_EMAILS_FROM', 'DGEC_EMAIL'];

mandatoryVariables.forEach((variable) => {
  if (!process.env[variable]) {
    console.error(`Missing ${variable} environment variable`);
    process.exit(1);
  }
});

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  console.error('Missing SESSION_SECRET environment variable');
  process.exit(1);
}

const port: number = Number(process.env.PORT) || 3000;
makeServer(port, sessionSecret);
