import { mediator } from 'mediateur';
import { Abandon, CahierDesCharges } from '@potentiel-domain/laureat';
import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { ConsulterAppelOffreQuery, AppelOffre } from '@potentiel-domain/appel-offre';
import { decodeParameter } from '@/utils/decodeParameter';
import { getModèleRéponseAbandon } from '@potentiel-infrastructure/document-builder';
import { getUser } from '@/utils/getUtilisateur';

export const GET = async (request: Request, { params: { identifiant } }: IdentifiantParameter) => {
  const identifiantProjet = decodeParameter(identifiant);

  const utilisateur = await getUser();

  const candidature = await mediator.send<ConsulterCandidatureQuery>({
    type: 'CONSULTER_CANDIDATURE_QUERY',
    data: {
      identifiantProjet,
    },
  });

  const abandon = await mediator.send<Abandon.ConsulterAbandonQuery>({
    type: 'CONSULTER_ABANDON_QUERY',
    data: {
      identifiantProjetValue: identifiantProjet,
    },
  });

  const appelOffres = await mediator.send<ConsulterAppelOffreQuery>({
    type: 'CONSULTER_APPEL_OFFRE_QUERY',
    data: { identifiantAppelOffre: candidature.appelOffre },
  });

  const { cahierDesChargesChoisi } =
    await mediator.send<CahierDesCharges.ConsulterCahierDesChargesChoisiQuery>({
      type: 'CONSULTER_CAHIER_DES_CHARGES_QUERY',
      data: { identifiantProjet },
    });

  const dispositionCDC = getCDCAbandonRefs({
    appelOffres,
    période: candidature.période,
    cahierDesChargesChoisi,
  });

  const props: Parameters<typeof getModèleRéponseAbandon>[0] = {
    aprèsConfirmation: abandon.demande.confirmation?.confirméLe ? true : false,
    data: {
      adresseCandidat: '!!!!!! DONNEE MANQUANTE !!!!!!',
      codePostalProjet: candidature.localité.codePostal,
      communeProjet: candidature.localité.commune,
      contenuParagrapheAbandon: dispositionCDC.contenuParagrapheAbandon,
      dateConfirmation: abandon.demande.confirmation?.confirméLe?.formatter() || '',
      dateDemande: abandon.demande.demandéLe.formatter(),
      dateDemandeConfirmation: abandon.demande.confirmation?.demandéLe.formatter() || '',
      dateNotification: candidature.dateDésignation,
      dreal: candidature.localité.région,
      email: '',
      familles: candidature.famille ? 'yes' : '',
      ...getEdfType(candidature.localité.région),
      justificationDemande: abandon.demande.raison,
      nomCandidat: candidature.candidat.nom,
      nomProjet: candidature.nom,
      nomRepresentantLegal: candidature.candidat.représentantLégal,
      puissance: candidature.puissance.toString(),
      referenceParagrapheAbandon: dispositionCDC.referenceParagrapheAbandon,
      refPotentiel: identifiantProjet,
      status: abandon.statut.statut,
      suiviPar: utilisateur?.nom || '',
      suiviParEmail: appelOffres.dossierSuiviPar,
      titreAppelOffre: appelOffres.title,
      titreFamille: candidature.famille || '',
      titrePeriode:
        appelOffres.periodes.find((période) => période.id === candidature.période)?.title || '',
      unitePuissance: appelOffres.unitePuissance,
    },
  };

  const result = await getModèleRéponseAbandon(props);

  return new Response(result, {
    headers: {
      'content-type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    },
  });
};

function getEdfType(region: string) {
  if (!region) {
    return {
      isEDFOA: '',
      isEDFSEI: '',
      isEDM: '',
    };
  }

  return {
    isEDFOA: `${
      !['Guadeloupe', 'Guyane', 'Martinique', 'Corse', 'La Réunion', 'Mayotte'].includes(region)
        ? 'true'
        : ''
    }`,
    isEDFSEI: `${
      ['Guadeloupe', 'Guyane', 'Martinique', 'Corse', 'La Réunion'].includes(region) ? 'true' : ''
    }`,
    isEDM: `${region === 'Mayotte' ? 'true' : ''}`,
  };
}

function getCDCAbandonRefs({
  appelOffres,
  période,
  cahierDesChargesChoisi,
}: {
  appelOffres: AppelOffre;
  période: string;
  cahierDesChargesChoisi: string;
}) {
  const périodeDetails = appelOffres.periodes.find((periode) => periode.id === période);
  // Convertir le CDC en value type pour rechercher le CDC modifié dispo par type et date de parution
  // Vérifier les dispositions du CDC si existantes
  // sinon, vérifier les dispositions de la période
  // sinon, vérifier les dispositions de l'AO

  // return { contenuParagrapheAbandon: '', referenceParagrapheAbandon: '' };
}
