import { Role } from '@potentiel-domain/utilisateur';

import { Recipient } from '#sendEmail';

import { listerRecipients } from './listerRecipients.js';

export const listerAdminEtValidateursRecipients = async (): Promise<Recipient[]> =>
  listerRecipients({ roles: [Role.admin.nom, Role.dgecValidateur.nom] });
