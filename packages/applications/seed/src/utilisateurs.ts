/* eslint-disable no-restricted-imports */
import { mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Région, Utilisateur } from '@potentiel-domain/utilisateur';
import { InviterUtilisateurCommand } from '@potentiel-domain/utilisateur/src/inviter/inviterUtilisateur.command.js';

const régionsMap: Record<Région.RawType, string> = {
  'Auvergne-Rhône-Alpes': 'auvergne',
  'Bourgogne-Franche-Comté': 'bourgogne',
  Bretagne: 'bretagne',
  'Centre-Val de Loire': 'centre',
  'Grand Est': 'grandest',
  'Hauts-de-France': 'hautsdefrance',
  'Île-de-France': 'idf',
  Normandie: 'normandie',
  'Nouvelle-Aquitaine': 'aquitaine',
  Occitanie: 'occitanie',
  'Pays de la Loire': 'pdl',
  "Provence-Alpes-Côte d'Azur": 'paca',
  'La Réunion': 'reunion',
  Corse: 'corse',
  Guadeloupe: 'guadeloupe',
  Guyane: 'guyane',
  Martinique: 'martinique',
  Mayotte: 'mayotte',
};

const dreals = Object.entries(régionsMap).map(
  ([région, id]): Utilisateur.RawType => ({
    identifiantUtilisateur: `dreal+${id}@test.test`,
    rôle: 'dreal',
    région: région as Région.RawType,
  }),
);
const utilisateurs: Utilisateur.RawType[] = [
  { identifiantUtilisateur: 'admin@test.test', rôle: 'admin' },
  { identifiantUtilisateur: 'cre@test.test', rôle: 'cre' },
  { identifiantUtilisateur: 'ademe@test.test', rôle: 'ademe' },
  { identifiantUtilisateur: 'caissedesdepots@test.test', rôle: 'caisse-des-dépôts' },
  {
    identifiantUtilisateur: 'dgec-validateur@test.test',
    rôle: 'dgec-validateur',
    fonction: 'Fonction du validateur',
    nomComplet: 'Nom du validateur',
  },
  {
    identifiantUtilisateur: 'dreal@test.test',
    rôle: 'dreal',
    région: 'Île-de-France',
  },
  {
    identifiantUtilisateur: 'grd@test.test',
    rôle: 'grd',
    identifiantGestionnaireRéseau: '17X100A100A0001A',
  },
  {
    identifiantUtilisateur: 'cocontractant@test.test',
    rôle: 'cocontractant',
    zone: 'métropole',
  },
  {
    identifiantUtilisateur: 'cocontractant+zni@test.test',
    rôle: 'cocontractant',
    zone: 'zni',
  },
  {
    identifiantUtilisateur: 'cocontractant+mayotte@test.test',
    rôle: 'cocontractant',
    zone: 'mayotte',
  },
  ...dreals,
];

export const seedUtilisateurs = async () => {
  for (const utilisateur of utilisateurs) {
    try {
      // TODO use case
      await mediator.send<InviterUtilisateurCommand>({
        type: 'Utilisateur.Command.InviterUtilisateur',
        data: {
          utilisateur: Utilisateur.convertirEnValueType(utilisateur),
          invitéLe: DateTime.now(),
          invitéPar: Email.système,
        },
      });
    } catch (error) {
      console.log(utilisateur.identifiantUtilisateur, error.message);
      throw error;
    }
  }
};
