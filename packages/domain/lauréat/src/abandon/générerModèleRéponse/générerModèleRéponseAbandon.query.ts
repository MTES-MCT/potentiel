import { Message, MessageHandler, mediator } from 'mediateur';
import { Abandon, CahierDesCharges } from '@potentiel-domain/laureat';
import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { ConsulterAppelOffreQuery, AppelOffre } from '@potentiel-domain/appel-offre';
import { ConsulterUtilisateurQuery } from '@potentiel-domain/utilisateur';

export type GénérerModèleRéponseAbandonReadModel = {
  format: string;
  content: ReadableStream;
};

export type GénérerModèleRéponseAbandonQuery = Message<
  'GENERER_MODELE_REPONSE_ABANDON_QUERY',
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

export const GegistergénérerModèleRéponseAbandonQuery = ({
  buildModèleRéponseAbandon,
}: GénérerModèleRéponseAbandonDependencies) => {
  const handler: MessageHandler<GénérerModèleRéponseAbandonQuery> = async ({
    identifiantProjet,
    identifiantUtilisateur,
  }) => {
    const utilisateur = await mediator.send<ConsulterUtilisateurQuery>({
      type: 'CONSULTER_UTILISATEUR_QUERY',
      data: {
        identifiantUtilisateur,
      },
    });

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

    const content = await buildModèleRéponseAbandon({
      aprèsConfirmation: abandon.demande.confirmation?.confirméLe ? true : false,
      data: {
        adresseCandidat: candidature.candidat.adressePostale,
        codePostalProjet: candidature.localité.codePostal,
        communeProjet: candidature.localité.commune,
        contenuParagrapheAbandon: dispositionCDC.dispositions,
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
  mediator.register('GENERER_MODELE_REPONSE_ABANDON_QUERY', handler);
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
