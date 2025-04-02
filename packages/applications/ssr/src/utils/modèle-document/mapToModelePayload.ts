import {
  formatDateForDocument,
  ModèleRéponseSignée,
} from '@potentiel-applications/document-builder';
import { Candidature } from '@potentiel-domain/candidature';
import { Lauréat, Puissance, ReprésentantLégal } from '@potentiel-domain/laureat';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import { formatBoolean } from './formatBoolean';
import { formatIdentifiantProjetForDocument } from './formatIdentifiantProjetForDocument';

type FormatProjectDataProps = {
  identifiantProjet: string;
  représentantLégal: ReprésentantLégal.ConsulterReprésentantLégalReadModel;
  puissance: Puissance.ConsulterPuissanceReadModel;
  lauréat: Lauréat.ConsulterLauréatReadModel;
  candidature: Candidature.ConsulterCandidatureReadModel;
  appelOffres: AppelOffre.AppelOffreReadModel;
  période: AppelOffre.Periode;
  famille: AppelOffre.Famille | undefined;
  utilisateur: Utilisateur.ValueType;
};

export const mapToModelePayload = ({
  identifiantProjet,
  lauréat,
  puissance,
  représentantLégal,
  candidature,
  appelOffres,
  période,
  famille,
  utilisateur,
}: FormatProjectDataProps): ModèleRéponseSignée.ModèleRéponse & { logo?: string } => {
  const régionDreal = Option.isSome(utilisateur.région) ? utilisateur.région : undefined;

  return {
    logo: régionDreal,
    data: {
      adresseCandidat: [
        lauréat.localité.adresse1,
        lauréat.localité.adresse2,
        `${lauréat.localité.codePostal} ${lauréat.localité.commune}`,
      ]
        .filter(Boolean)
        .join('\n'),
      codePostalProjet: lauréat.localité.codePostal,
      communeProjet: candidature.localité.commune,

      dateNotification: formatDateForDocument(lauréat.notifiéLe.date),
      dreal: régionDreal ?? '',
      email: candidature.emailContact.formatter(),
      familles: formatBoolean(!!famille),
      nomCandidat: candidature.nomCandidat,
      nomProjet: lauréat.nomProjet,
      nomRepresentantLegal: représentantLégal.nomReprésentantLégal,
      puissance: puissance.puissance.toString(),
      refPotentiel: formatIdentifiantProjetForDocument(identifiantProjet),
      suiviParEmail: appelOffres.dossierSuiviPar,
      titreAppelOffre: appelOffres.title,
      titreFamille: famille?.id ?? '',
      titrePeriode: période.title || '',
      unitePuissance: appelOffres.unitePuissance,
      suiviPar: utilisateur.identifiantUtilisateur.formatter(),
    },
  };
};
