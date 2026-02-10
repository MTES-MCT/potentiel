import { Message, MessageHandler, mediator } from 'mediateur';

import { LeftJoin, List, RangeOptions, Where } from '@potentiel-domain/entity';

import { Candidature, IdentifiantProjet } from '../../index.js';
import { AccèsEntity } from '../accès.entity.js';

export type ProjetÀRéclamerReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  nomProjet: string;
  puissance: number;
  région: string;
  emailContact: string;
};

export type ListerProjetsÀRéclamerReadModel = {
  items: Array<ProjetÀRéclamerReadModel>;
  range: RangeOptions;
  total: number;
};

export type ListerProjetsÀRéclamerQuery = Message<
  'Projet.Accès.Query.ListerProjetsÀRéclamer',
  {
    appelOffre?: Array<string>;
    période?: string;
    nomProjet?: string;
    nomCandidat?: string;
    range?: RangeOptions;
  },
  ListerProjetsÀRéclamerReadModel
>;

export type ListerProjetsÀRéclamerDependencies = {
  list: List;
};

export const registerListerProjetsÀRéclamerQuery = ({
  list,
}: ListerProjetsÀRéclamerDependencies) => {
  const handler: MessageHandler<ListerProjetsÀRéclamerQuery> = async ({
    appelOffre,
    période,
    nomProjet,
    nomCandidat,
    range,
  }) => {
    const candidatures = await list<Candidature.CandidatureEntity, LeftJoin<AccèsEntity>>(
      'candidature',
      {
        where: {
          estNotifiée: Where.equal(true),
          appelOffre: appelOffre?.length ? Where.matchAny(appelOffre) : undefined,
          période: Where.equal(période),
          nomProjet: Where.like(nomProjet),
          nomCandidat: Where.like(nomCandidat),
        },
        join: {
          entity: 'accès',
          on: 'identifiantProjet',
          type: 'left',
          where: {
            identifiantProjet: Where.equalNull(),
          },
        },
        range,
      },
    );

    return {
      items: candidatures.items.map(mapToReadModel),
      range: candidatures.range,
      total: candidatures.total,
    };
  };

  mediator.register('Projet.Accès.Query.ListerProjetsÀRéclamer', handler);
};

const mapToReadModel = ({
  identifiantProjet,
  nomProjet,
  puissance,
  localité,
  emailContact,
}: Candidature.CandidatureEntity): ProjetÀRéclamerReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  nomProjet,
  puissance,
  région: localité.région,
  emailContact,
});
