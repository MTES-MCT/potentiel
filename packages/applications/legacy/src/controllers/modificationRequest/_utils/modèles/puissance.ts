import { formatDateForDocument } from '@potentiel-applications/document-builder';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/candidature';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { CahierDesCharges, Lauréat, ReprésentantLégal } from '@potentiel-domain/laureat';
import { formatIdentifiantProjetForDocument } from '../formatIdentifiantProjetForDocument';
import { getEnCopies } from '../getEnCopies';
import { Option } from '@potentiel-libraries/monads';
import { Utilisateur } from '@potentiel-domain/utilisateur';

export const mapToPuissanceModèleRéponseProps = ({
  identifiantProjet,
  lauréat,
  appelOffres,
  candidature,
  cahierDesChargesChoisi,
  nouvellePuissance,
  puissanceActuelle,
  justification,
  représentantLégal,
  utilisateur,
  dateDemande,
}: {
  identifiantProjet: IdentifiantProjet.ValueType;
  lauréat: Lauréat.ConsulterLauréatReadModel;
  appelOffres: AppelOffre.ConsulterAppelOffreReadModel;
  candidature: Candidature.ConsulterCandidatureReadModel;
  cahierDesChargesChoisi: CahierDesCharges.ConsulterCahierDesChargesChoisiReadmodel;
  représentantLégal: Option.Type<ReprésentantLégal.ConsulterReprésentantLégalReadModel>;
  nouvellePuissance: number;
  puissanceActuelle: number;
  justification: string;
  utilisateur: Pick<Utilisateur.ValueType, 'nom'>;
  dateDemande: Date;
}) => {
  const période = appelOffres.periodes.find((période) => période.id === identifiantProjet.période);
  const paragraphe = getDonnéesCourriersRéponse({
    appelOffres,
    période: identifiantProjet.période,
    cahierDesChargesChoisi,
  });

  return {
    // Données projet
    adresseCandidat: [
      lauréat.localité.adresse1,
      lauréat.localité.adresse2,
      `${lauréat.localité.codePostal} ${lauréat.localité.commune}`,
    ]
      .filter(Boolean)
      .join('\n'),
    codePostalProjet: lauréat.localité.codePostal,
    communeProjet: lauréat.localité.commune,
    dateNotification: formatDateForDocument(lauréat.notifiéLe.date),
    familles: identifiantProjet.famille ? ('yes' as const) : ('' as const),
    dreal: candidature.localité.région,
    email: candidature.emailContact.formatter(),
    nomCandidat: candidature.nomCandidat,
    nomProjet: lauréat.nomProjet,
    nomRepresentantLegal: Option.match(représentantLégal)
      .some((rl) => rl.nomReprésentantLégal)
      .none(() => candidature.nomReprésentantLégal),
    refPotentiel: formatIdentifiantProjetForDocument(identifiantProjet),
    titreAppelOffre: appelOffres.title,
    titreFamille:
      période?.familles.find((famille) => famille.id === identifiantProjet.famille)?.title || '',
    titrePeriode: période?.title || '',
    puissance: puissanceActuelle.toString(),
    unitePuissance: appelOffres.unitePuissance,

    // Spécifique puissance
    puissanceActuelle: puissanceActuelle.toString(),
    nouvellePuissance: nouvellePuissance.toString(),
    puissanceInitiale:
      candidature.puissanceProductionAnnuelle !== puissanceActuelle
        ? candidature.puissanceProductionAnnuelle.toString()
        : '',
    referenceParagraphePuissance: paragraphe.référenceParagraphe,
    contenuParagraphePuissance: paragraphe.dispositions,

    // Demande
    dateDemande: formatDateForDocument(dateDemande),
    justificationDemande: justification,
    enCopies: getEnCopies(lauréat.localité.région),
    suiviPar: utilisateur.nom,
    suiviParEmail: appelOffres.dossierSuiviPar,
  };
};

const getDonnéesCourriersRéponse = ({
  appelOffres,
  période,
  cahierDesChargesChoisi,
}: {
  appelOffres: AppelOffre.AppelOffreReadModel;
  période: string;
  cahierDesChargesChoisi: CahierDesCharges.ConsulterCahierDesChargesChoisiReadmodel;
}): AppelOffre.DonnéesCourriersRéponse['texteChangementDePuissance'] => {
  const périodeDetails = appelOffres.periodes.find((periode) => periode.id === période);

  return {
    référenceParagraphe: '!!!REFERENCE NON DISPONIBLE!!!',
    dispositions: '!!!CONTENU NON DISPONIBLE!!!',
    ...appelOffres.donnéesCourriersRéponse.texteChangementDePuissance,
    ...périodeDetails?.donnéesCourriersRéponse?.texteChangementDePuissance,
    ...(cahierDesChargesChoisi.type === 'initial'
      ? {}
      : cahierDesChargesChoisi.donnéesCourriersRéponse?.texteChangementDePuissance),
  };
};
