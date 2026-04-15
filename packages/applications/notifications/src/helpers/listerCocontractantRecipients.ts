import { Role } from '@potentiel-domain/utilisateur';

import { Recipient } from '#sendEmail';

import { listerRecipients } from './listerRecipients.js';

export const listerCocontractantRecipients = async (zones: Array<string>): Promise<Recipient[]> =>
  listerRecipients({ roles: [Role.cocontractant.nom], zones });
