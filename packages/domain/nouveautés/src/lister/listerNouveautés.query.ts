import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import { Role } from '@potentiel-domain/utilisateur';

import type { LienNouveauté, Nouveauté } from '../nouveauté.type.js';
import type { RécupérerNouveautésPort } from './listerNouveautés.port.js';

export type NouveautéReadModel = {
  titre: string;
  description?: string;
  date?: DateTime.ValueType;
  lien?: LienNouveauté;
};

export type ListerNouveautésReadModel = {
  items: ReadonlyArray<NouveautéReadModel>;
};

export type ListerNouveautésQuery = Message<
  'Nouveautés.Query.ListerNouveautés',
  {
    rôle: Role.RawType;
    limite?: number;
  },
  ListerNouveautésReadModel
>;

export type ListerNouveautésDependencies = {
  récupérerNouveautés: RécupérerNouveautésPort;
};

export const registerListerNouveautésQuery = ({
  récupérerNouveautés,
}: ListerNouveautésDependencies) => {
  const handler: MessageHandler<ListerNouveautésQuery> = async ({ rôle, limite }) => {
    const rôleUtilisateur = Role.convertirEnValueType(rôle);
    const nouveautés = await récupérerNouveautés({ limite });

    return {
      items: nouveautés
        .filter(({ rôles }) => rôles.includes(rôleUtilisateur.nom))
        .map(mapToReadModel),
    };
  };

  mediator.register('Nouveautés.Query.ListerNouveautés', handler);
};

const mapToReadModel = ({ titre, description, date, lien }: Nouveauté): NouveautéReadModel => ({
  titre,
  description,
  date: date ? DateTime.convertirEnValueType(date) : undefined,
  lien,
});
