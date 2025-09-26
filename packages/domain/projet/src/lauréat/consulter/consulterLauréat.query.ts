import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find, Joined, LeftJoin } from '@potentiel-domain/entity';
import { DateTime, Email } from '@potentiel-domain/common';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { DocumentProjet } from '@potentiel-domain/document';

import { LauréatEntity } from '../lauréat.entity';
import { Candidature, IdentifiantProjet } from '../..';
import { Abandon, StatutLauréat } from '..';
import { CandidatureEntity, Localité, TypeTechnologie, UnitéPuissance } from '../../candidature';
import { mapToReadModel as mapToCandidatureReadModel } from '../../candidature/consulter/consulterCandidature.query';
import { AttestationConformité } from '../achèvement';

export type ConsulterLauréatReadModel = {
  identifiantProjet: IdentifiantProjet.ValueType;
  notifiéLe: DateTime.ValueType;
  notifiéPar: Email.ValueType;
  nomProjet: string;
  localité: Localité.ValueType;
  technologie: TypeTechnologie.ValueType<AppelOffre.Technologie>;
  unitéPuissance: UnitéPuissance.ValueType;
  statut: StatutLauréat.ValueType;
  /** non définie en cas de recours accordé ou projet d'une période "legacy" */
  attestationDésignation?: DocumentProjet.ValueType;
  autorisationDUrbanisme: Candidature.Dépôt.ValueType['autorisationDUrbanisme'];
} & Pick<
  Candidature.Dépôt.ValueType,
  // on ne sélectionne que des propriétés non modifiables de Candidature
  // Pour des propriétés modifiables comme la puissance, on utilisera ConsulterPuissance
  'emailContact' | 'nomCandidat' | 'prixReference' | 'coefficientKChoisi'
>;

export type ConsulterLauréatQuery = Message<
  'Lauréat.Query.ConsulterLauréat',
  {
    identifiantProjet: string;
  },
  Option.Type<ConsulterLauréatReadModel>
>;

export type ConsulterLauréatDependencies = {
  find: Find;
};

type LauréatJoins = [
  CandidatureEntity,
  LeftJoin<AttestationConformité.AttestationConformitéEntity>,
  LeftJoin<Abandon.AbandonEntity>,
];
export const registerConsulterLauréatQuery = ({ find }: ConsulterLauréatDependencies) => {
  const handler: MessageHandler<ConsulterLauréatQuery> = async ({ identifiantProjet }) => {
    const lauréat = await find<LauréatEntity, LauréatJoins>(`lauréat|${identifiantProjet}`, {
      join: [
        {
          entity: 'candidature',
          on: 'identifiantProjet',
        },

        { entity: 'attestation-conformité', on: 'identifiantProjet', type: 'left' },
        { entity: 'abandon', on: 'identifiantProjet', type: 'left' },
      ],
    });

    if (Option.isNone(lauréat)) {
      return lauréat;
    }

    const candidatureReadModel = mapToCandidatureReadModel(lauréat.candidature);

    return mapToReadModel(lauréat, candidatureReadModel);
  };
  mediator.register('Lauréat.Query.ConsulterLauréat', handler);
};

type MapToReadModel = (
  lauréat: LauréatEntity & Joined<LauréatJoins>,
  candidature: Candidature.ConsulterCandidatureReadModel,
) => ConsulterLauréatReadModel;

const mapToReadModel: MapToReadModel = (
  {
    identifiantProjet,
    notifiéLe,
    notifiéPar,
    nomProjet,
    localité: { adresse1, adresse2, codePostal, commune, département, région },
    abandon,
    'attestation-conformité': attestationConformité,
  },
  candidature,
) => ({
  identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
  notifiéLe: DateTime.convertirEnValueType(notifiéLe),
  notifiéPar: Email.convertirEnValueType(notifiéPar),
  nomProjet,
  localité: Localité.bind({
    adresse1,
    adresse2,
    codePostal,
    commune,
    département,
    région,
  }),
  statut: attestationConformité
    ? StatutLauréat.achevé
    : abandon && Abandon.StatutAbandon.convertirEnValueType(abandon.statut).estAccordé()
      ? StatutLauréat.abandonné
      : StatutLauréat.actif,
  technologie: candidature.technologie,
  unitéPuissance: candidature.unitéPuissance,
  emailContact: candidature.dépôt.emailContact,
  nomCandidat: candidature.dépôt.nomCandidat,
  prixReference: candidature.dépôt.prixReference,
  coefficientKChoisi: candidature.dépôt.coefficientKChoisi,
  attestationDésignation: candidature.instruction.statut.estClassé()
    ? candidature.notification?.attestation
    : undefined,
  autorisationDUrbanisme: candidature.dépôt.autorisationDUrbanisme,
});
