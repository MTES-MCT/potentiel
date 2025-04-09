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
import { Puissance, CahierDesCharges } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { formatIdentifiantProjetForDocument } from '@/utils/modèle-document/formatIdentifiantProjetForDocument';
import { getPériodeAppelOffres } from '@/app/_helpers/getPériodeAppelOffres';
import { getEnCopies } from '@/utils/modèle-document/getEnCopies';
import { getDocxDocumentHeader } from '@/utils/modèle-document/getDocxDocumentHeader';

export const GET = async (
  request: NextRequest,
  { params: { identifiant } }: IdentifiantParameter,
) =>
  withUtilisateur(async (utilisateur) => {
    const identifiantProjet = decodeParameter(identifiant);

    const candidature = await mediator.send<Candidature.ConsulterProjetQuery>({
      type: 'Candidature.Query.ConsulterProjet',
      data: {
        identifiantProjet,
      },
    });
    const { appelOffres, période } = await getPériodeAppelOffres(
      IdentifiantProjet.convertirEnValueType(identifiantProjet),
    );

    if (Option.isNone(candidature)) {
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

    const puissance = await mediator.send<Puissance.ConsulterPuissanceQuery>({
      type: 'Lauréat.Puissance.Query.ConsulterPuissance',
      data: { identifiantProjet },
    });

    if (Option.isNone(puissance) || !puissance.dateDemandeEnCours) {
      return notFound();
    }

    const demandeDeChangement = await mediator.send<Puissance.ConsulterChangementPuissanceQuery>({
      type: 'Lauréat.Puissance.Query.ConsulterChangementPuissance',
      data: { identifiantProjet, demandéLe: puissance.dateDemandeEnCours.formatter() },
    });

    if (Option.isNone(demandeDeChangement)) {
      return notFound();
    }

    const texteChangementDePuissance = getDonnéesCourriersRéponse({
      appelOffres,
      cahierDesChargesChoisi,
      période,
    });

    const régionDreal = Option.isSome(utilisateur.région) ? utilisateur.région : undefined;

    const refPotentiel = formatIdentifiantProjetForDocument(identifiantProjet);
    const type = 'puissance';
    const content = await ModèleRéponseSignée.générerModèleRéponseAdapter({
      type,
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
        justificationDemande: demandeDeChangement.demande.raison ?? '',
        nomCandidat: candidature.candidat.nom,
        nomProjet: candidature.nom,
        nomRepresentantLegal: candidature.candidat.représentantLégal,
        puissance: candidature.puissance.toString(),
        refPotentiel,
        suiviPar: utilisateur.nom,
        suiviParEmail: appelOffres.dossierSuiviPar,
        titreAppelOffre: appelOffres.title,
        titreFamille: candidature.famille || '',
        titrePeriode: période.title || '',
        unitePuissance: appelOffres.unitePuissance,
        enCopies: getEnCopies(candidature.localité.région),
        nouvellePuissance: demandeDeChangement.demande.nouvellePuissance.toString(),
        referenceParagraphePuissance: texteChangementDePuissance.référenceParagraphe,
        contenuParagraphePuissance: texteChangementDePuissance?.dispositions,
        puissanceActuelle: puissance.puissance.toString(),
      },
    });

    return new Response(content, {
      headers: getDocxDocumentHeader({ identifiantProjet, nomProjet: candidature.nom, type }),
    });
  });

const getDonnéesCourriersRéponse = ({
  appelOffres,
  période,
  cahierDesChargesChoisi,
}: {
  appelOffres: AppelOffre.AppelOffreReadModel;
  période: AppelOffre.Periode;
  cahierDesChargesChoisi: CahierDesCharges.ConsulterCahierDesChargesChoisiReadmodel;
}): AppelOffre.DonnéesCourriersRéponse['texteChangementDeProducteur'] => {
  return {
    référenceParagraphe: '!!!REFERENCE NON DISPONIBLE!!!',
    dispositions: '!!!CONTENU NON DISPONIBLE!!!',
    ...appelOffres.donnéesCourriersRéponse.texteChangementDeProducteur,
    ...période?.donnéesCourriersRéponse?.texteChangementDeProducteur,
    ...(cahierDesChargesChoisi.type === 'initial'
      ? {}
      : cahierDesChargesChoisi.donnéesCourriersRéponse?.texteChangementDeProducteur),
  };
};
