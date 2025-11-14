import { match } from 'ts-pattern';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { getCahierDesChargesLauréat } from './getCahierDesChargesLauréat.js';
import { listerDrealsRecipients } from './listerDrealsRecipients.js';

type ListerRecipientsAutoritéInstructriceProps = {
  identifiantProjet: IdentifiantProjet.ValueType;
  région: string;
  domain: 'abandon' | 'délai';
};

export const listerRecipientsAutoritéInstructrice = async ({
  identifiantProjet,
  région,
  domain,
}: ListerRecipientsAutoritéInstructriceProps): Promise<{ email: string }[]> => {
  const cahierDesCharges = await getCahierDesChargesLauréat(identifiantProjet);
  return match(cahierDesCharges.getAutoritéCompétente(domain))
    .with('dgec', () => [{ email: cahierDesCharges.appelOffre.dossierSuiviPar }])
    .with('dreal', () => listerDrealsRecipients(région))
    .exhaustive();
};
