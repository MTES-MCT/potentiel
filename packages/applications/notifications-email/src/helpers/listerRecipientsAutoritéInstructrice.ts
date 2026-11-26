import { match } from 'ts-pattern';

import type { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import type { Recipient } from '#sendEmail';
import { getCahierDesChargesLauréat } from './getCahierDesChargesLauréat.js';
import { listerDrealsRecipients } from './listerDrealsRecipients.js';

type ListerRecipientsAutoritéInstructriceProps = {
  identifiantProjet: IdentifiantProjet.ValueType;
  région: string;
} & (
  | {
      domain: 'abandon';
    }
  | {
      domain: 'délai';
      motif: Lauréat.Délai.MotifDemandeDélai.ValueType;
    }
);

export const listerRecipientsAutoritéInstructrice = async ({
  identifiantProjet,
  région,
  ...props
}: ListerRecipientsAutoritéInstructriceProps): Promise<Recipient[]> => {
  const cahierDesCharges = await getCahierDesChargesLauréat(identifiantProjet);
  return match(cahierDesCharges.getAutoritéCompétente(props))
    .with('dgec', () => [cahierDesCharges.appelOffre.dossierSuiviPar])
    .with('dreal', () => listerDrealsRecipients(région))
    .exhaustive();
};
