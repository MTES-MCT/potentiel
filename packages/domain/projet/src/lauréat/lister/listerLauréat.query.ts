import { Message, MessageHandler, mediator } from 'mediateur';

import { Email } from '@potentiel-domain/common';
import { List, RangeOptions, Where } from '@potentiel-domain/entity';

import { LauréatEntity } from '../lauréat.entity';
import { GetProjetUtilisateurScope, IdentifiantProjet } from '../..';
import { Localité } from '../../candidature';

type LauréatListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  localité: Localité.ValueType;

  //////////// TODO
  // faire un multi join sur les champs suivants :

  producteur: string; // ConsulterProducteurReadModel
  représentantLégal: { nom: string; email: string }; // ConsulterReprésentantLégalReadModel
  puissance: {
    unité: string;
    valeur: number;
  }; // ConsulterPuissanceReadModel
  prixReference: number; // ConsulterCandidatureReadModel
  evaluationCarboneSimplifiée: number; // ConsulterCandidatureReadModel
};

export type ListerLauréatReadModel = {
  items: ReadonlyArray<LauréatListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerLauréatQuery = Message<
  'Lauréat.Query.ListerLauréat',
  {
    utilisateur: Email.RawType;
    range: RangeOptions;
    nomProjet?: string;
    appelOffre?: string;
  },
  ListerLauréatReadModel
>;

export type ListerLauréatDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
};

export const registerListerLauréatQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerLauréatDependencies) => {
  const handler: MessageHandler<ListerLauréatQuery> = async ({
    utilisateur,
    nomProjet,
    appelOffre,
    range,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));

    const lauréats = await list<LauréatEntity>('lauréat', {
      range,
      orderBy: {
        nomProjet: 'ascending',
      },
      where: {
        identifiantProjet:
          scope.type === 'projet' ? Where.matchAny(scope.identifiantProjets) : undefined,
        nomProjet: Where.contain(nomProjet),
        appelOffre: Where.equal(appelOffre),
        localité: { région: scope.type === 'region' ? Where.equal(scope.region) : undefined },
      },
    });

    return {
      ...lauréats,
      items: lauréats.items.map((lauréat) => mapToReadModel(lauréat)),
    };
  };

  mediator.register('Lauréat.Query.ListerLauréat', handler);
};

const mapToReadModel = ({
  nomProjet,
  identifiantProjet,
  localité,
}: LauréatEntity): LauréatListItemReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  nomProjet,
  localité: Localité.bind(localité),
  producteur: 'Producteur WIP',
  représentantLégal: { nom: 'Représentant légal WIP', email: 'representant.legal@wip.com' },
  puissance: {
    unité: 'MWc',
    valeur: 100,
  },
  prixReference: 10000,
  evaluationCarboneSimplifiée: 200,
});
