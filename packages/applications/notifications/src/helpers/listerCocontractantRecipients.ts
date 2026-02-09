import { Role, Zone } from '@potentiel-domain/utilisateur';

import { Recipient } from '#sendEmail';

import { listerRecipients } from './listerRecipients.js';

export const listerCocontractantRecipients = async (région: string): Promise<Recipient[]> =>
  listerRecipients({ roles: [Role.cocontractant.nom], zone: Zone.déterminer(région).nom });
