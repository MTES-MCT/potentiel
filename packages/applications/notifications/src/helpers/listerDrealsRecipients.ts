import { Role } from '@potentiel-domain/utilisateur';

import { Recipient } from '#sendEmail';

import { listerRecipients } from './listerRecipients.js';

export const listerDrealsRecipients = async (région: string): Promise<Recipient[]> =>
  listerRecipients({ roles: [Role.dreal.nom], région });
