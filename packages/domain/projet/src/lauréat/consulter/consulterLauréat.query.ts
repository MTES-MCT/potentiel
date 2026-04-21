import { Message, MessageHandler, mediator } from 'mediateur';

import { Option } from '@potentiel-libraries/monads';
import { Find, Joined } from '@potentiel-domain/entity';
import { DateTime, Email } from '@potentiel-domain/common';
import { AppelOffre } from '@potentiel-domain/appel-offre';

import { LauréatEntity } from '../lauréat.entity.js';
import { Candidature, DocumentProjet, IdentifiantProjet } from '../../index.js';
import { StatutLauréat } from '../index.js';
import {
  CandidatureEntity,
  Localité,
  TypeTechnologie,
  UnitéPuissance,
} from '../../candidature/index.js';
import { mapToReadModel as mapToCandidatureReadModel } from '../../candidature/consulter/consulterCandidature.query.js';

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
  autorisation: Candidature.Dépôt.ValueType['autorisation'];
} & Pick<
  Candidature.Dépôt.ValueType,
  // on ne sélectionne que des propriétés non modifiable dans la vie du projet, issues de Candidature
  // Pour des propriétés modifiables comme la puissance, on utilisera ConsulterPuissance
  'emailContact' | 'nomCandidat' | 'prixReference' | 'coefficientKChoisi' | 'actionnariat'
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

type LauréatJoins = [CandidatureEntity, AppelOffre.AppelOffreEntity];

export const registerConsulterLauréatQuery = ({ find }: ConsulterLauréatDependencies) => {
  const handler: MessageHandler<ConsulterLauréatQuery> = async ({ identifiantProjet }) => {
    const lauréat = await find<LauréatEntity, LauréatJoins>(`lauréat|${identifiantProjet}`, {
      join: [
        {
          entity: 'candidature',
          on: 'identifiantProjet',
        },
        {
          entity: 'appel-offre',
          on: 'appelOffre',
        },
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

const mapToReadModel: MapToReadModel = (lauréat, candidature) => {
  return {
    identifiantProjet: IdentifiantProjet.convertirEnValueType(lauréat.identifiantProjet),
    notifiéLe: DateTime.convertirEnValueType(lauréat.notifiéLe),
    notifiéPar: Email.convertirEnValueType(lauréat.notifiéPar),
    nomProjet: lauréat.nomProjet,
    localité: Localité.bind({
      adresse1: lauréat.localité.adresse1,
      adresse2: lauréat.localité.adresse2,
      codePostal: lauréat.localité.codePostal,
      commune: lauréat.localité.commune,
      département: lauréat.localité.département,
      région: lauréat.localité.région,
    }),
    statut: StatutLauréat.convertirEnValueType(lauréat.statut),
    technologie: candidature.technologie,
    unitéPuissance: candidature.unitéPuissance,
    emailContact: candidature.dépôt.emailContact,
    nomCandidat: candidature.dépôt.nomCandidat,
    prixReference: candidature.dépôt.prixReference,
    coefficientKChoisi: getCoefficientKChoisiLauréat(lauréat, candidature.dépôt.coefficientKChoisi),
    attestationDésignation: candidature.instruction.statut.estClassé()
      ? candidature.notification?.attestation
      : undefined,
    autorisation: candidature.dépôt.autorisation,
    actionnariat: candidature.dépôt.actionnariat,
  };
};

const getCoefficientKChoisiLauréat = (
  lauréat: LauréatEntity & Joined<LauréatJoins>,
  coefficientKChoisi: Candidature.Dépôt.ValueType['coefficientKChoisi'],
) => {
  const période = lauréat['appel-offre'].periodes.find((p) => p.id === lauréat.période);

  if (!période) {
    return coefficientKChoisi;
  }

  const ref = AppelOffre.RéférenceCahierDesCharges.convertirEnValueType(lauréat.cahierDesCharges);

  // seuls des cdc modifiés peuvent avoir un coefficient K différent du coefficient K choisi lors de la candidature
  if (ref.type !== 'modifié') {
    return coefficientKChoisi;
  }

  const cdcModificatif = période.cahiersDesChargesModifiésDisponibles.find((c) =>
    ref.estÉgaleÀ(AppelOffre.RéférenceCahierDesCharges.bind(c)),
  );

  return cdcModificatif?.champsSupplémentaires?.coefficientKChoisi?.type === 'défaut'
    ? cdcModificatif?.champsSupplémentaires?.coefficientKChoisi.valeur
    : coefficientKChoisi;
};
