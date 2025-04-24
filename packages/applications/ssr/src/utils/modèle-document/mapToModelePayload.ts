import {
  formatDateForDocument,
  ModèleRéponseSignée,
} from '@potentiel-applications/document-builder';
import { Puissance, ReprésentantLégal } from '@potentiel-domain/laureat';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { DateTime, Email } from '@potentiel-domain/common';

import { formatBoolean } from './formatBoolean';
import { formatIdentifiantProjetForDocument } from './formatIdentifiantProjetForDocument';

type CommonProps = {
  identifiantProjet: string;

  appelOffres: AppelOffre.AppelOffreReadModel;
  période: AppelOffre.Periode;
  famille: AppelOffre.Famille | undefined;
  utilisateur: Utilisateur.ValueType;
};

type MapToModelePayloadProps = CommonProps & {
  nomReprésentantLégal: string;
  puissance: number;
  localité: Candidature.ConsulterCandidatureReadModel['localité'];
  nomProjet: Candidature.ConsulterCandidatureReadModel['nomProjet'];
  notifiéLe: DateTime.ValueType | undefined;
  emailContact: Email.ValueType;
  nomCandidat: string;
};

const mapToModelePayload = ({
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
}: MapToModelePayloadProps): ModèleRéponseSignée.ModèleRéponse & { logo?: string } => {
  const régionDreal = Option.isSome(utilisateur.région) ? utilisateur.région : undefined;

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
      suiviPar: utilisateur.nom,
      suiviParEmail: appelOffres.dossierSuiviPar,
      titreAppelOffre: appelOffres.title,
      titreFamille: famille?.id ?? '',
      titrePeriode: période.title || '',
      unitePuissance: appelOffres.unitePuissance,
    },
  };
};

type MapCandidatureToModelePayloadProps = CommonProps & {
  candidature: Candidature.ConsulterCandidatureReadModel;
};

export const mapCandidatureToModelePayload = ({
  candidature,
  ...props
}: MapCandidatureToModelePayloadProps) =>
  mapToModelePayload({
    ...props,
    emailContact: candidature.emailContact,
    localité: candidature.localité,
    nomCandidat: candidature.nomCandidat,
    nomProjet: candidature.nomProjet,
    nomReprésentantLégal: candidature.nomReprésentantLégal,
    puissance: candidature.puissanceProductionAnnuelle,
    notifiéLe: candidature.notification?.notifiéeLe,
  });

type MapLauréatToModelePayloadProps = MapCandidatureToModelePayloadProps & {
  puissance: Puissance.ConsulterPuissanceReadModel;
  représentantLégal: ReprésentantLégal.ConsulterReprésentantLégalReadModel;
  lauréat: Lauréat.ConsulterLauréatReadModel;
};

export const mapLauréatToModelePayload = ({
  puissance,
  représentantLégal,
  lauréat,
  ...props
}: MapLauréatToModelePayloadProps) => ({
  ...mapCandidatureToModelePayload(props),
  localité: lauréat.localité,
  nomProjet: lauréat.nomProjet,
  nomReprésentantLégal: représentantLégal.nomReprésentantLégal,
  puissance: puissance.puissance,
});
