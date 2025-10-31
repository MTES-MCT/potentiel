import {
  formatDateForDocument,
  ModèleRéponseSignée,
} from '@potentiel-applications/document-builder';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';
import { PotentielUtilisateur } from '@potentiel-applications/request-context';

import { formatBoolean } from './formatBoolean';
import { formatIdentifiantProjetForDocument } from './formatIdentifiantProjetForDocument';

type CommonProps = {
  identifiantProjet: string;

  appelOffres: PlainType<AppelOffre.AppelOffreReadModel>;
  période: PlainType<AppelOffre.Periode>;
  famille: PlainType<AppelOffre.Famille> | undefined;
  utilisateur: PotentielUtilisateur;
};

type MapToModèlePayloadProps = CommonProps & {
  nomReprésentantLégal: string;
  puissance: number;
  localité: Candidature.Localité.ValueType;
  nomProjet: string;
  unitéPuissance: Candidature.UnitéPuissance.ValueType;
  notifiéLe: DateTime.ValueType | undefined;
  emailContact: Email.ValueType;
  nomCandidat: string;
};

const mapToModèleRéponsePayload = ({
  identifiantProjet,
  localité,
  nomProjet,
  puissance,
  nomReprésentantLégal,
  nomCandidat,
  emailContact,
  notifiéLe,
  appelOffres,
  période,
  famille,
  utilisateur,
  unitéPuissance,
}: MapToModèlePayloadProps): ModèleRéponseSignée.ModèleRéponse & { logo?: string } => {
  const régionDreal = utilisateur.estDreal() ? utilisateur.région.formatter() : undefined;

  return {
    logo: régionDreal,
    data: {
      adresseCandidat: [
        localité.adresse1,
        localité.adresse2,
        `${localité.codePostal} ${localité.commune}`,
      ]
        .filter(Boolean)
        .join('\n'),
      codePostalProjet: localité.codePostal,
      communeProjet: localité.commune,

      dateNotification: notifiéLe ? formatDateForDocument(notifiéLe.date) : '',
      dreal: régionDreal ?? '',
      email: emailContact.formatter(),
      familles: formatBoolean(!!famille),
      nomCandidat,
      nomProjet,
      nomRepresentantLegal: nomReprésentantLégal,
      puissance: puissance.toString(),
      refPotentiel: formatIdentifiantProjetForDocument(identifiantProjet),
      suiviPar: utilisateur.nom ?? '',
      suiviParEmail: appelOffres.dossierSuiviPar,
      titreAppelOffre: appelOffres.title,
      titreFamille: famille?.id ?? '',
      titrePeriode: période.title || '',
      unitePuissance: unitéPuissance.formatter(),
    },
  };
};

type MapCandidatureToModèleRéponsePayloadProps = CommonProps & {
  candidature: Candidature.ConsulterCandidatureReadModel;
};

export const mapCandidatureToModèleRéponsePayload = ({
  candidature,
  ...props
}: MapCandidatureToModèleRéponsePayloadProps) =>
  mapToModèleRéponsePayload({
    ...props,
    emailContact: candidature.dépôt.emailContact,
    localité: candidature.dépôt.localité,
    nomCandidat: candidature.dépôt.nomCandidat,
    nomProjet: candidature.dépôt.nomProjet,
    nomReprésentantLégal: candidature.dépôt.nomReprésentantLégal,
    puissance: candidature.dépôt.puissanceProductionAnnuelle,
    notifiéLe: candidature.notification?.notifiéeLe,
    unitéPuissance: candidature.unitéPuissance,
  });

type MapLauréatToModelePayloadProps = CommonProps & {
  puissance: Lauréat.Puissance.ConsulterPuissanceReadModel;
  représentantLégal: Lauréat.ReprésentantLégal.ConsulterReprésentantLégalReadModel;
  lauréat: Lauréat.ConsulterLauréatReadModel;
};

export const mapLauréatToModèleRéponsePayload = ({
  puissance,
  représentantLégal,
  lauréat,
  ...props
}: MapLauréatToModelePayloadProps) =>
  mapToModèleRéponsePayload({
    ...props,
    emailContact: lauréat.emailContact,
    localité: lauréat.localité,
    nomCandidat: lauréat.nomCandidat,
    nomProjet: lauréat.nomProjet,
    notifiéLe: lauréat.notifiéLe,
    unitéPuissance: lauréat.unitéPuissance,
    nomReprésentantLégal: représentantLégal.nomReprésentantLégal,
    puissance: puissance.puissance,
  });
