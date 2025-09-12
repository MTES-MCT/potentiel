import { Message, MessageHandler, mediator } from 'mediateur';

import { DateTime, Email } from '@potentiel-domain/common';
import { Joined, List, RangeOptions, Where } from '@potentiel-domain/entity';

import { StatutRecours } from '..';
import { RecoursEntity } from '../recours.entity';
import { Candidature, IdentifiantProjet } from '../../..';
import { GetProjetUtilisateurScope } from '../../../getScopeProjetUtilisateur.port';

type RecoursListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  appelOffre: string;
  période: string;
  famille?: string;
  nomProjet: string;
  statut: StatutRecours.ValueType;
  misÀJourLe: DateTime.ValueType;
};

export type ListerRecoursReadModel = {
  items: Array<RecoursListItemReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerRecoursQuery = Message<
  'Éliminé.Recours.Query.ListerRecours',
  {
    utilisateur: Email.RawType;
    statut?: Array<StatutRecours.RawType>;
    appelOffre?: string;
    nomProjet?: string;
    range?: RangeOptions;
  },
  ListerRecoursReadModel
>;

export type ListerRecoursDependencies = {
  list: List;
  getScopeProjetUtilisateur: GetProjetUtilisateurScope;
};

export const registerListerRecoursQuery = ({
  list,
  getScopeProjetUtilisateur,
}: ListerRecoursDependencies) => {
  const handler: MessageHandler<ListerRecoursQuery> = async ({
    statut,
    appelOffre,
    nomProjet,
    utilisateur,
    range,
  }) => {
    const scope = await getScopeProjetUtilisateur(Email.convertirEnValueType(utilisateur));

    console.log('STATUT', statut);

    const recours = await list<RecoursEntity, Candidature.CandidatureEntity>('recours', {
      orderBy: { misÀJourLe: 'descending' },
      range,
      where: {
        identifiantProjet:
          scope.type === 'projet' ? Where.matchAny(scope.identifiantProjets) : undefined,
        statut: Where.matchAny(statut),
      },
      join: {
        entity: 'candidature',
        on: 'identifiantProjet',
        where: {
          appelOffre: Where.equal(appelOffre),
          nomProjet: Where.contain(nomProjet),
          localité: {
            région: scope.type === 'region' ? Where.equal(scope.region) : undefined,
          },
        },
      },
    });

    return {
      ...recours,
      items: recours.items.map((recours) => mapToReadModel(recours)),
    };
  };

  mediator.register('Éliminé.Recours.Query.ListerRecours', handler);
};

const mapToReadModel = (
  entity: RecoursEntity & Joined<Candidature.CandidatureEntity>,
): RecoursListItemReadModel => {
  const { appelOffre, période, famille } = IdentifiantProjet.convertirEnValueType(
    entity.identifiantProjet,
  );

  return {
    appelOffre,
    période,
    famille,
    nomProjet: entity.candidature?.nomProjet ?? 'N/A',
    statut: StatutRecours.convertirEnValueType(entity.statut),
    misÀJourLe: DateTime.convertirEnValueType(entity.misÀJourLe),
    identifiantProjet: IdentifiantProjet.convertirEnValueType(entity.identifiantProjet),
  };
};
