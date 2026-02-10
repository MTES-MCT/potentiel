import { Message, MessageHandler, mediator } from 'mediateur';

import { List, RangeOptions, Where } from '@potentiel-domain/entity';
import { Email } from '@potentiel-domain/common';

import { CandidatureEntity } from '../candidature.entity.js';
import { ConsulterCandidatureReadModel } from '../consulter/consulterCandidature.query.js';
import * as StatutCandidature from '../statutCandidature.valueType.js';
import { DocumentProjet, IdentifiantProjet } from '../../index.js';
import { Dépôt, Localité, TypeActionnariat, UnitéPuissance } from '../index.js';

export type CandidaturesListItemReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  statut: StatutCandidature.ValueType;
  nomProjet: Dépôt.ValueType['nomProjet'];
  nomCandidat: Dépôt.ValueType['nomCandidat'];
  nomReprésentantLégal: Dépôt.ValueType['nomReprésentantLégal'];
  emailContact: Dépôt.ValueType['emailContact'];
  puissance: number;
  prixReference: Dépôt.ValueType['prixReference'];
  evaluationCarboneSimplifiée: Dépôt.ValueType['evaluationCarboneSimplifiée'];
  localité: Localité.ValueType;
  estNotifiée: boolean;
  attestation?: DocumentProjet.ValueType;
  unitéPuissance: ConsulterCandidatureReadModel['unitéPuissance'];
  typeActionnariat?: Dépôt.ValueType['actionnariat'];
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
    statut?: StatutCandidature.RawType;
    appelOffre?: Array<string>;
    période?: string;
    famille?: string;
    estNotifiée?: boolean;
    typeActionnariat?: Array<TypeActionnariat.RawType>;
    nomProjet?: string;
    identifiantProjets?: Array<IdentifiantProjet.RawType>;
  },
  ListerCandidaturesReadModel
>;

export type ListerCandidaturesQueryDependencies = {
  list: List;
};

export const registerListerCandidaturesQuery = ({ list }: ListerCandidaturesQueryDependencies) => {
  const handler: MessageHandler<ListerCandidaturesQuery> = async ({
    range,
    statut,
    appelOffre,
    période,
    famille,
    estNotifiée,
    typeActionnariat,
    nomProjet,
    identifiantProjets,
  }) => {
    const {
      items,
      range: { endPosition, startPosition },
      total,
    } = await list<CandidatureEntity>('candidature', {
      where: {
        statut: Where.equal(statut),
        appelOffre: appelOffre?.length ? Where.matchAny(appelOffre) : undefined,
        période: Where.equal(période),
        famille: Where.equal(famille),
        estNotifiée: Where.equal(estNotifiée),
        actionnariat:
          typeActionnariat && typeActionnariat.length > 0
            ? Where.matchAny(typeActionnariat)
            : undefined,
        nomProjet: Where.like(nomProjet),
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
  puissance,
  prixReference,
  localité,
  evaluationCarboneSimplifiée,
  estNotifiée,
  notification,
  unitéPuissance,
  actionnariat,
}: CandidatureEntity): CandidaturesListItemReadModel => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  statut: StatutCandidature.convertirEnValueType(statut),
  nomProjet,
  nomReprésentantLégal,
  emailContact: Email.convertirEnValueType(emailContact),
  puissance,
  prixReference,
  evaluationCarboneSimplifiée,
  nomCandidat,
  localité: Localité.bind(localité),
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
  unitéPuissance: UnitéPuissance.convertirEnValueType(unitéPuissance),
  typeActionnariat: actionnariat ? TypeActionnariat.convertirEnValueType(actionnariat) : undefined,
});
