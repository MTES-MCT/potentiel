import { Message, MessageHandler, mediator } from 'mediateur';
import { match, Pattern } from 'ts-pattern';

import { List, RangeOptions } from '@potentiel-domain/core';
import { IdentifiantProjet, StatutProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { CandidatureEntity } from '../candidature.entity';
import { ConsulterCandidatureReadModel } from '../candidature';

export type CandidaturesListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutProjet.ValueType;
  nomProjet: ConsulterCandidatureReadModel['nomProjet'];
  nomCandidat: ConsulterCandidatureReadModel['nomCandidat'];
  nomReprésentantLégal: ConsulterCandidatureReadModel['nomReprésentantLégal'];
  emailContact: ConsulterCandidatureReadModel['emailContact'];
  puissanceProductionAnnuelle: number;
  prixReference: ConsulterCandidatureReadModel['prixReference'];
  evaluationCarboneSimplifiée: ConsulterCandidatureReadModel['evaluationCarboneSimplifiée'];
  localité: {
    commune: ConsulterCandidatureReadModel['localité']['commune'];
    département: ConsulterCandidatureReadModel['localité']['département'];
    région: ConsulterCandidatureReadModel['localité']['région'];
  };
  détails: ConsulterCandidatureReadModel['détails'];
};

export type ListerCandidaturesReadModel = Readonly<{
  items: Array<CandidaturesListItemReadModel>;
  range: RangeOptions;
  total: number;
}>;

export type ListerCandidaturesQuery = Message<
  'Candidature.Query.ListerCandidatures',
  {
    range?: RangeOptions;
    appelOffre?: string;
    période?: string;
    nomProjet?: string;
    statut?: StatutProjet.RawType;
  },
  ListerCandidaturesReadModel
>;

export type ListerCandidaturesQueryDependencies = {
  list: List;
};

export const registerListerCandidaturesQuery = ({ list }: ListerCandidaturesQueryDependencies) => {
  const handler: MessageHandler<ListerCandidaturesQuery> = async ({
    range,
    nomProjet,
    appelOffre,
    période,
    statut,
  }) => {
    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<CandidatureEntity>('candidature', {
      where: {
        appelOffre: match(appelOffre)
          .with(Pattern.nullish, () => undefined)
          .otherwise((value) => ({ operator: 'equal', value })),
        période: match(période)
          .with(Pattern.nullish, () => undefined)
          .otherwise((value) => ({ operator: 'equal', value })),
        nomProjet: match(nomProjet)
          .with(Pattern.nullish, () => undefined)
          .otherwise((value) => ({
            operator: 'like',
            value: `%${value}%`,
          })),
        statut: match(statut)
          .with(Pattern.nullish, () => undefined)
          .otherwise((value) => ({ operator: 'equal', value })),
      },
      range,
    });

    return {
      items: items.map(mapToReadModel),
      range: {
        endPosition,
        startPosition,
      },
      total,
    };
  };
  mediator.register('Candidature.Query.ListerCandidatures', handler);
};

export const mapToReadModel = ({
  identifiantProjet,
  statut,
  nomProjet,
  nomCandidat,
  nomReprésentantLégal,
  emailContact,
  puissanceProductionAnnuelle,
  prixReference,
  localité: { commune, département, région },
  evaluationCarboneSimplifiée,
  misÀJourLe,
}: CandidatureEntity): CandidaturesListItemReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  statut: StatutProjet.convertirEnValueType(statut),
  nomProjet,
  nomCandidat,
  nomReprésentantLégal,
  emailContact,
  puissanceProductionAnnuelle,
  prixReference,
  evaluationCarboneSimplifiée,
  localité: {
    commune,
    département,
    région,
  },
  détails: DocumentProjet.convertirEnValueType(
    identifiantProjet,
    'candidature/import',
    misÀJourLe,
    'application/json',
  ),
});
