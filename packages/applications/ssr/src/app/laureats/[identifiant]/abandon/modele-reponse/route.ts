import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Abandon, CahierDesCharges } from '@potentiel-domain/laureat';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/candidature';
import { DateTime } from '@potentiel-domain/common';
import { ConsulterUtilisateurQuery } from '@potentiel-domain/utilisateur';
import { ModèleRéponseSignée } from '@potentiel-applications/document-builder';
import { Option } from '@potentiel-libraries/monads';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { formatIdentifiantProjetForDocument } from '@/utils/modèle-document/formatIdentifiantProjetForDocument';

export const GET = async (_: Request, { params: { identifiant } }: IdentifiantParameter) =>
  withUtilisateur(async (utilisateur) => {
    const identifiantProjet = decodeParameter(identifiant);

    const utilisateurDétails = await mediator.send<ConsulterUtilisateurQuery>({
      type: 'Utilisateur.Query.ConsulterUtilisateur',
      data: {
        identifiantUtilisateur: utilisateur.identifiantUtilisateur.formatter(),
      },
    });

    if (Option.isNone(utilisateurDétails)) {
      return notFound();
    }

    const { nomComplet } = utilisateurDétails;

    const candidature = await mediator.send<Candidature.ConsulterProjetQuery>({
      type: 'Candidature.Query.ConsulterProjet',
      data: {
        identifiantProjet,
      },
    });

    if (Option.isNone(candidature)) {
      return notFound();
    }

    const abandon = await mediator.send<Abandon.ConsulterAbandonQuery>({
      type: 'Lauréat.Abandon.Query.ConsulterAbandon',
      data: {
        identifiantProjetValue: identifiantProjet,
      },
    });

    if (Option.isNone(abandon)) {
      return notFound();
    }

    const appelOffres = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: { identifiantAppelOffre: candidature.appelOffre },
    });

    if (Option.isNone(appelOffres)) {
      return notFound();
    }

    const cahierDesChargesChoisi =
      await mediator.send<CahierDesCharges.ConsulterCahierDesChargesChoisiQuery>({
        type: 'Lauréat.CahierDesCharges.Query.ConsulterCahierDesChargesChoisi',
        data: { identifiantProjet },
      });

    if (Option.isNone(cahierDesChargesChoisi)) {
      return notFound();
    }

    const dispositionCDC = getCDCAbandonRefs({
      appelOffres,
      période: candidature.période,
      cahierDesChargesChoisi,
    });

    const content = await ModèleRéponseSignée.générerModèleRéponseAdapter({
      type: 'abandon',
      data: {
        aprèsConfirmation: abandon.demande.confirmation?.confirméLe ? true : false,
        adresseCandidat: candidature.candidat.adressePostale,
        codePostalProjet: candidature.localité.codePostal,
        communeProjet: candidature.localité.commune,
        contenuParagrapheAbandon: dispositionCDC.dispositions,
        dateConfirmation:
          abandon.demande.confirmation?.confirméLe?.date.toLocaleDateString('fr-FR') ??
          'JJ/MM/AAAA',
        dateDemande: abandon.demande.demandéLe.date.toLocaleDateString('fr-FR'),
        dateDemandeConfirmation:
          abandon.demande.confirmation?.demandéeLe.date.toLocaleDateString('fr-FR') ?? 'JJ/MM/AAAA',
        dateNotification: DateTime.convertirEnValueType(
          candidature.dateDésignation,
        ).date.toLocaleDateString('fr-FR'),
        dreal: candidature.localité.région,
        email: '',
        familles: candidature.famille ? 'yes' : '',
        justificationDemande: abandon.demande.raison,
        nomCandidat: candidature.candidat.nom,
        nomProjet: candidature.nom,
        nomRepresentantLegal: candidature.candidat.représentantLégal,
        puissance: candidature.puissance.toString(),
        referenceParagrapheAbandon: dispositionCDC.référenceParagraphe,
        refPotentiel: formatIdentifiantProjetForDocument(identifiantProjet),
        status: abandon.statut.statut,
        suiviPar: nomComplet || '',
        suiviParEmail: appelOffres.dossierSuiviPar,
        titreAppelOffre: appelOffres.title,
        titreFamille: candidature.famille || '',
        titrePeriode:
          appelOffres.periodes.find((période) => période.id === candidature.période)?.title || '',
        unitePuissance: appelOffres.unitePuissance,
        enCopies: getEnCopies(candidature.localité.région),
      },
    });

    return new Response(content, {
      headers: {
        'content-type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
    });
  });

const getEnCopies = (region: string): Array<string> => {
  if (!region) {
    return ['DREAL concernée', 'CRE'];
  }

  const enCopie = [];

  if (['Guadeloupe', 'Guyane', 'Martinique', 'Corse', 'La Réunion', 'Mayotte'].includes(region)) {
    enCopie.push('EDF OA');
  }

  if (['Guadeloupe', 'Guyane', 'Martinique', 'Corse', 'La Réunion'].includes(region)) {
    enCopie.push('EDF SEI');
  }

  if (['Mayotte'].includes(region)) {
    enCopie.push('EDN');
  }

  return [...enCopie, `DREAL ${region}`, 'CRE'];
};

const getCDCAbandonRefs = ({
  appelOffres,
  période,
  cahierDesChargesChoisi,
}: {
  appelOffres: AppelOffre.AppelOffreReadModel;
  période: string;
  cahierDesChargesChoisi: string;
}) => {
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
};

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
