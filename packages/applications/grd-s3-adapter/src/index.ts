import { getAccessToken } from './auth';
import { getAllDossiers } from './raccordement';
import { parseConfig } from './config';
import { uploadToS3 } from './s3';

async function main() {
  const config = parseConfig();

  const accessToken = await getAccessToken({
    clientId: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
    issuerUrl: config.ISSUER_URL,
  });

  const dossiers = await getAllDossiers({ apiUrl: config.API_URL, accessToken });
  if (dossiers.length === 0) {
    console.log('Aucun dossier de raccordement');
    return;
  }

  await uploadToS3({ data: dossiers });
}

void main();
