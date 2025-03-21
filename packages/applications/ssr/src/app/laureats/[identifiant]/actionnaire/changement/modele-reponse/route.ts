import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';
import { NextRequest } from 'next/server';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/candidature';
import { DateTime } from '@potentiel-domain/common';
import {
  formatDateForDocument,
  ModèleRéponseSignée,
} from '@potentiel-applications/document-builder';
import { Option } from '@potentiel-libraries/monads';
import { Actionnaire, CahierDesCharges } from '@potentiel-domain/laureat';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { formatIdentifiantProjetForDocument } from '@/utils/modèle-document/formatIdentifiantProjetForDocument';

export const GET = async (
  request: NextRequest,
  { params: { identifiant } }: IdentifiantParameter,
) =>
  withUtilisateur(async (utilisateur) => {
    const identifiantProjet = decodeParameter(identifiant);
    const estAccordé = request.nextUrl.searchParams.get('estAccordé') === 'true';

    const candidature = await mediator.send<Candidature.ConsulterProjetQuery>({
      type: 'Candidature.Query.ConsulterProjet',
      data: {
        identifiantProjet,
      },
    });

    if (Option.isNone(candidature)) {
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

    const actionnaire = await mediator.send<Actionnaire.ConsulterActionnaireQuery>({
      type: 'Lauréat.Actionnaire.Query.ConsulterActionnaire',
      data: { identifiantProjet },
    });

    if (Option.isNone(actionnaire) || !actionnaire.dateDemandeEnCours) {
      return notFound();
    }

    const demandeDeChangement =
      await mediator.send<Actionnaire.ConsulterChangementActionnaireQuery>({
        type: 'Lauréat.Actionnaire.Query.ConsulterChangementActionnaire',
        data: { identifiantProjet, demandéLe: actionnaire.dateDemandeEnCours.formatter() },
      });

    if (Option.isNone(demandeDeChangement)) {
      return notFound();
    }

    const texteChangementDActionnariat = getDonnéesCourriersRéponse({
      appelOffres,
      cahierDesChargesChoisi,
      période: candidature.période,
    });

    const régionDreal = Option.isSome(utilisateur.région) ? utilisateur.région : undefined;

    const refPotentiel = formatIdentifiantProjetForDocument(identifiantProjet);
    const content = await ModèleRéponseSignée.générerModèleRéponseAdapter({
      type: 'actionnaire',
      logo: régionDreal,
      data: {
        adresseCandidat: candidature.candidat.adressePostale,
        codePostalProjet: candidature.localité.codePostal,
        communeProjet: candidature.localité.commune,
        dateDemande: formatDateForDocument(demandeDeChangement.demande.demandéeLe.date),
        dateNotification: formatDateForDocument(
          DateTime.convertirEnValueType(candidature.dateDésignation).date,
        ),
        dreal: régionDreal ?? '',
        email: candidature.candidat.contact,
        familles: candidature.famille ? 'yes' : '',
        justificationDemande: demandeDeChangement.demande.raison,
        nomCandidat: candidature.candidat.nom,
        nomProjet: candidature.nom,
        nomRepresentantLegal: candidature.candidat.représentantLégal,
        puissance: candidature.puissance.toString(),
        refPotentiel,
        suiviPar: utilisateur.nom,
        suiviParEmail: appelOffres.dossierSuiviPar,
        titreAppelOffre: appelOffres.title,
        titreFamille: candidature.famille || '',
        titrePeriode:
          appelOffres.periodes.find((période) => période.id === candidature.période)?.title || '',
        unitePuissance: appelOffres.unitePuissance,
        enCopies: getEnCopies(candidature.localité.région),
        nouvelActionnaire: demandeDeChangement.demande.nouvelActionnaire,
        referenceParagrapheActionnaire: texteChangementDActionnariat.référenceParagraphe,
        contenuParagrapheActionnaire: texteChangementDActionnariat?.dispositions,
        estAccordé,
      },
    });

    const dateStr = new Intl.DateTimeFormat('fr').format(new Date()).replaceAll('/', '-');
    return new Response(content, {
      headers: {
        'content-type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        // 2025-01-08_Eolien - 1 - 2 - 3_[TEST] Projet 01.docx
        'content-disposition': `attachment; filename="${dateStr}_${refPotentiel}_${encodeURIComponent(candidature.nom)}.docx"`,
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

const getDonnéesCourriersRéponse = ({
  appelOffres,
  période,
  cahierDesChargesChoisi,
}: {
  appelOffres: AppelOffre.AppelOffreReadModel;
  période: string;
  cahierDesChargesChoisi: CahierDesCharges.ConsulterCahierDesChargesChoisiReadmodel;
}): AppelOffre.DonnéesCourriersRéponse['texteChangementDActionnariat'] => {
  const périodeDetails = appelOffres.periodes.find((periode) => periode.id === période);

  return {
    référenceParagraphe: '!!!REFERENCE NON DISPONIBLE!!!',
    dispositions: '!!!CONTENU NON DISPONIBLE!!!',
    ...appelOffres.donnéesCourriersRéponse.texteChangementDActionnariat,
    ...périodeDetails?.donnéesCourriersRéponse?.texteChangementDActionnariat,
    ...(cahierDesChargesChoisi.type === 'initial'
      ? {}
      : cahierDesChargesChoisi.donnéesCourriersRéponse?.texteChangementDActionnariat),
  };
};
