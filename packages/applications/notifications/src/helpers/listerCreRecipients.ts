import { Role } from '@potentiel-domain/utilisateur';

import { Recipient } from '#sendEmail';

import { listerRecipients } from './listerRecipients.js';

export const listerCreRecipients = async (): Promise<Recipient[]> =>
  listerRecipients({ roles: [Role.cre.nom] });
