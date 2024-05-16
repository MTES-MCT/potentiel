import { Message, MessageHandler, mediator } from 'mediateur';
import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { ConsulterAppelOffreQuery, AppelOffre } from '@potentiel-domain/appel-offre';
import { ConsulterUtilisateurQuery } from '@potentiel-domain/utilisateur';
import { ConsulterAbandonQuery } from '../consulter/consulterAbandon.query';
import { ConsulterCahierDesChargesChoisiQuery } from '../../cahierDesChargesChoisi/consulter/consulterCahierDesChargesChoisi.query';
import { DateTime } from '@potentiel-domain/common';

export type GénérerModèleRéponseAbandonReadModel = {
  format: string;
  content: ReadableStream;
};

export type GénérerModèleRéponseAbandonQuery = Message<
  'Document.Query.GénérerModèleRéponseAbandon',
  {
    identifiantProjet: string;
    identifiantUtilisateur: string;
  },
  GénérerModèleRéponseAbandonReadModel
>;

export type BuildModèleRéponseAbandonPort = (options: {
  aprèsConfirmation: boolean;
  data: {
    suiviPar: string; // user qui édite le document
    suiviParEmail: string; // email dgec var env
    refPotentiel: string; // identifiantProjet

    dreal: string; // région projet

    status: string;

    nomRepresentantLegal: string;
    nomCandidat: string;
    adresseCandidat: string;
    email: string;

    titrePeriode: string;
    titreAppelOffre: string;
    familles: 'yes' | '';
    titreFamille: string;
    dateNotification: string;

    nomProjet: string;
    codePostalProjet: string;
    communeProjet: string;
    puissance: string;
    unitePuissance: string;

    dateDemande: string;
    justificationDemande: string;

    referenceParagrapheAbandon: string;
    contenuParagrapheAbandon: string;

    dateDemandeConfirmation: string;
    dateConfirmation: string;

    isEDFOA: string;
    isEDFSEI: string;
    isEDM: string;
  };
}) => Promise<ReadableStream>;

export type GénérerModèleRéponseAbandonDependencies = {
  buildModèleRéponseAbandon: BuildModèleRéponseAbandonPort;
};

export const registerGénérerModèleRéponseAbandonQuery = ({
  buildModèleRéponseAbandon,
}: GénérerModèleRéponseAbandonDependencies) => {
  const handler: MessageHandler<GénérerModèleRéponseAbandonQuery> = async ({
    identifiantProjet,
    identifiantUtilisateur,
  }) => {
    const utilisateur = await mediator.send<ConsulterUtilisateurQuery>({
      type: 'Utilisateur.Query.ConsulterUtilisateur',
      data: {
        identifiantUtilisateur,
      },
    });

    const candidature = await mediator.send<ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: {
        identifiantProjet,
      },
    });

    const abandon = await mediator.send<ConsulterAbandonQuery>({
      type: 'Lauréat.Abandon.Query.ConsulterAbandon',
      data: {
        identifiantProjetValue: identifiantProjet,
      },
    });

    const appelOffres = await mediator.send<ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: { identifiantAppelOffre: candidature.appelOffre },
    });

    const { cahierDesChargesChoisi } = await mediator.send<ConsulterCahierDesChargesChoisiQuery>({
      type: 'Lauréat.CahierDesCharges.Query.ConsulterCahierDesChargesChoisi',
      data: { identifiantProjet },
    });

    const dispositionCDC = getCDCAbandonRefs({
      appelOffres,
      période: candidature.période,
      cahierDesChargesChoisi,
    });

    const content = await buildModèleRéponseAbandon({
      aprèsConfirmation: abandon.demande.confirmation?.confirméLe ? true : false,
      data: {
        adresseCandidat: candidature.candidat.adressePostale,
        codePostalProjet: candidature.localité.codePostal,
        communeProjet: candidature.localité.commune,
        contenuParagrapheAbandon: dispositionCDC.dispositions,
        dateConfirmation: abandon.demande.confirmation?.confirméLe?.formatterEnFr() || '',
        dateDemande: abandon.demande.demandéLe.formatterEnFr(),
        dateDemandeConfirmation: abandon.demande.confirmation?.demandéLe.formatterEnFr() || '',
        dateNotification: DateTime.convertirEnValueType(
          candidature.dateDésignation,
        ).formatterEnFr(),
        dreal: candidature.localité.région,
        email: '',
        familles: candidature.famille ? 'yes' : '',
        ...getEdfType(candidature.localité.région),
        justificationDemande: abandon.demande.raison,
        nomCandidat: candidature.candidat.nom,
        nomProjet: candidature.nom,
        nomRepresentantLegal: candidature.candidat.représentantLégal,
        puissance: candidature.puissance.toString(),
        referenceParagrapheAbandon: dispositionCDC.référenceParagraphe,
        refPotentiel: identifiantProjet,
        status: abandon.statut.statut,
        suiviPar: utilisateur?.nomComplet || '',
        suiviParEmail: appelOffres.dossierSuiviPar,
        titreAppelOffre: appelOffres.title,
        titreFamille: candidature.famille || '',
        titrePeriode:
          appelOffres.periodes.find((période) => période.id === candidature.période)?.title || '',
        unitePuissance: appelOffres.unitePuissance,
      },
    });

    return {
      format: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      content,
    };
  };
  mediator.register('Document.Query.GénérerModèleRéponseAbandon', handler);
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
  const cdc = parseCahierDesChargesChoisi(cahierDesChargesChoisi);
  const cahierDesChargesModifié = périodeDetails?.cahiersDesChargesModifiésDisponibles.find(
    (c) => cdc.type === 'modifié' && c.paruLe === cdc.paruLe && c.alternatif === cdc.alternatif,
  );

  return {
    référenceParagraphe: '!!!REFERENCE NON DISPONIBLE!!!',
    dispositions: '!!!CONTENU NON DISPONIBLE!!!',
    ...appelOffres.donnéesCourriersRéponse.texteEngagementRéalisationEtModalitésAbandon,
    ...périodeDetails?.donnéesCourriersRéponse?.texteEngagementRéalisationEtModalitésAbandon,
    ...(cahierDesChargesModifié &&
      cahierDesChargesModifié.donnéesCourriersRéponse
        ?.texteEngagementRéalisationEtModalitésAbandon),
  };
}

const parseCahierDesChargesChoisi = (référence: string) => {
  if (référence === 'initial') {
    return { type: 'initial' };
  }

  return {
    type: 'modifié',
    paruLe: référence.replace('-alternatif', ''),
    alternatif: référence.search('-alternatif') === -1 ? undefined : true,
  };
};
