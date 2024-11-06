import { Message, MessageHandler, mediator } from 'mediateur';

import { List, RangeOptions, Where } from '@potentiel-domain/entity';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import * as StatutCandidature from '../statutCandidature.valueType';
import { CandidatureEntity } from '../candidature.entity';
import { ConsulterCandidatureReadModel, TypeGarantiesFinancières } from '../candidature';

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
  typeGarantiesFinancières?: TypeGarantiesFinancières.ValueType;
  localité: {
    commune: ConsulterCandidatureReadModel['localité']['commune'];
    département: ConsulterCandidatureReadModel['localité']['département'];
    région: ConsulterCandidatureReadModel['localité']['région'];
  };
  détailsImport: ConsulterCandidatureReadModel['détailsImport'];
  estNotifiée: boolean;
  attestation?: DocumentProjet.ValueType;
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
    estNotifiée?: boolean;
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
    identifiantProjets,
    estNotifiée,
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
        estNotifiée: Where.equal(estNotifiée),
        identifiantProjet: Where.include(identifiantProjets),
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
  détailsMisÀJourLe,
  estNotifiée,
  notification,
  typeGarantiesFinancières,
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
  typeGarantiesFinancières: typeGarantiesFinancières
    ? TypeGarantiesFinancières.convertirEnValueType(typeGarantiesFinancières)
    : undefined,
  localité: {
    commune,
    département,
    région,
  },
  détailsImport: DocumentProjet.convertirEnValueType(
    identifiantProjet,
    'candidature/import',
    détailsMisÀJourLe,
    'application/json',
  ),
  estNotifiée: estNotifiée,
  ...(estNotifiée &&
    notification.attestation && {
      attestation: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        'attestation',
        notification.attestation.généréeLe,
        notification.attestation.format,
      ),
    }),
});
