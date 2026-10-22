import { type Message, type MessageHandler, mediator } from 'mediateur';

import { DateTime } from '@potentiel-domain/common';
import type { RangeOptions } from '@potentiel-domain/entity';
import { Role } from '@potentiel-domain/utilisateur';

import type { Nouveauté } from '../nouveauté.type.js';
import type { RécupérerNouveautésPort } from './listerNouveautés.port.js';

export type NouveautéReadModel = {
  titre: string;
  description?: string;
  date?: DateTime.ValueType;
  lien?: string;
};

export type ListerNouveautésReadModel = {
  items: ReadonlyArray<NouveautéReadModel>;
};

export type ListerNouveautésQuery = Message<
  'Nouveautés.Query.ListerNouveautés',
  {
    rôle: Role.RawType;
    range?: RangeOptions;
  },
  ListerNouveautésReadModel
>;

export type ListerNouveautésDependencies = {
  récupérerNouveautés: RécupérerNouveautésPort;
};

export const registerListerNouveautésQuery = ({
  récupérerNouveautés,
}: ListerNouveautésDependencies) => {
  const handler: MessageHandler<ListerNouveautésQuery> = async ({ rôle, range }) => {
    const rôleUtilisateur = Role.convertirEnValueType(rôle);
    const nouveautés = await récupérerNouveautés();

    const nouveautésDuRôle = nouveautés.filter(({ rôles }) => rôles.includes(rôleUtilisateur.nom));

    return {
      items: (range
        ? nouveautésDuRôle.slice(range.startPosition, range.endPosition + 1)
        : nouveautésDuRôle
      ).map(mapToReadModel),
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
