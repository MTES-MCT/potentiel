import { Message, MessageHandler, mediator } from 'mediateur';

import { List, RangeOptions, Where } from '@potentiel-domain/entity';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import * as StatutCandidature from '../statutCandidature.valueType';
import { CandidatureEntity } from '../candidature.entity';
import { ConsulterCandidatureReadModel } from '../candidature';

export type CandidaturesListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutCandidature.ValueType;
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
    statut?: StatutCandidature.RawType;
    identifiantProjets?: Array<IdentifiantProjet.RawType>;
    excludedIdentifiantProjets?: Array<IdentifiantProjet.RawType>;
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
    excludedIdentifiantProjets,
    identifiantProjets,
  }) => {
    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<CandidatureEntity>('candidature', {
      where: {
        appelOffre: Where.equal(appelOffre),
        période: Where.equal(période),
        nomProjet: Where.contains(nomProjet),
        statut: Where.equal(statut),
        identifiantProjet: identifiantProjets?.length
          ? Where.include(identifiantProjets)
          : Where.notInclude(excludedIdentifiantProjets),
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
  statut: StatutCandidature.convertirEnValueType(statut),
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
