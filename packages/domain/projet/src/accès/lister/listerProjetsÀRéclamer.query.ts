import { Message, MessageHandler, mediator } from 'mediateur';

import { List, RangeOptions, Where } from '@potentiel-domain/entity';

import { Candidature, IdentifiantProjet } from '../..';
import { AccèsEntity } from '../accès.entity';

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
    appelOffre?: string;
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
    const accès = await list<AccèsEntity>('accès');

    const identifiantsProjets = accès.items
      .filter((accès) => accès.utilisateursAyantAccès.length > 0)
      .map((accès) => IdentifiantProjet.convertirEnValueType(accès.identifiantProjet).formatter());

    const candidatures = await list<Candidature.CandidatureEntity>('candidature', {
      where: {
        estNotifiée: Where.equal(true),
        appelOffre: Where.equal(appelOffre),
        période: Where.equal(période),
        nomProjet: Where.contain(nomProjet),
        nomCandidat: Where.contain(nomCandidat),
        identifiantProjet: Where.notMatchAny(identifiantsProjets),
      },
      range,
    });

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
  puissanceProductionAnnuelle,
  localité,
  emailContact,
}: Candidature.CandidatureEntity): ProjetÀRéclamerReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  nomProjet,
  puissance: puissanceProductionAnnuelle,
  région: localité.région,
  emailContact,
});
