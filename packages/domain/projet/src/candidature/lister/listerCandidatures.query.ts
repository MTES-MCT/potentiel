import { Message, MessageHandler, mediator } from 'mediateur';

import { List, RangeOptions, Where } from '@potentiel-domain/entity';
import { Email } from '@potentiel-domain/common';
import { DocumentProjet } from '@potentiel-domain/document';

import { CandidatureEntity } from '../candidature.entity';
import { ConsulterCandidatureReadModel } from '../consulter/consulterCandidature.query';
import * as StatutCandidature from '../statutCandidature.valueType';
import { IdentifiantProjet } from '../..';
import { Dépôt, UnitéPuissance } from '..';

export type CandidaturesListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutCandidature.ValueType;
  nomProjet: Dépôt.ValueType['nomProjet'];
  nomCandidat: Dépôt.ValueType['nomCandidat'];
  nomReprésentantLégal: Dépôt.ValueType['nomReprésentantLégal'];
  emailContact: Dépôt.ValueType['emailContact'];
  puissanceProductionAnnuelle: number;
  prixReference: Dépôt.ValueType['prixReference'];
  evaluationCarboneSimplifiée: Dépôt.ValueType['evaluationCarboneSimplifiée'];
  localité: {
    commune: Dépôt.ValueType['localité']['commune'];
    département: Dépôt.ValueType['localité']['département'];
    région: Dépôt.ValueType['localité']['région'];
  };
  estNotifiée: boolean;
  attestation?: DocumentProjet.ValueType;
  unitéPuissance: ConsulterCandidatureReadModel['unitéPuissance'];
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
        nomProjet: Where.contain(nomProjet),
        statut: Where.equal(statut),
        estNotifiée: Where.equal(estNotifiée),
        identifiantProjet: Where.matchAny(identifiantProjets),
      },
      range,
      orderBy: {
        appelOffre: 'ascending',
        période: 'ascending',
        nomProjet: 'ascending',
      },
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
  estNotifiée,
  notification,
  unitéPuissanceCalculée,
}: CandidatureEntity): CandidaturesListItemReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  statut: StatutCandidature.convertirEnValueType(statut),
  nomProjet,
  nomReprésentantLégal,
  emailContact: Email.convertirEnValueType(emailContact),
  puissanceProductionAnnuelle,
  prixReference,
  evaluationCarboneSimplifiée,
  nomCandidat,
  localité: {
    commune,
    département,
    région,
  },
  estNotifiée,
  ...(estNotifiée &&
    notification.attestation && {
      attestation: DocumentProjet.convertirEnValueType(
        identifiantProjet,
        'attestation',
        notification.attestation.généréeLe,
        notification.attestation.format,
      ),
    }),
  unitéPuissance: UnitéPuissance.convertirEnValueType(unitéPuissanceCalculée),
});
