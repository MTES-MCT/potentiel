import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';
import { NextRequest } from 'next/server';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';
import {
  formatDateForDocument,
  ModèleRéponseSignée,
} from '@potentiel-applications/document-builder';
import { Option } from '@potentiel-libraries/monads';
import { Actionnaire } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { apiAction } from '@/utils/apiAction';
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
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);
      const estAccordé = request.nextUrl.searchParams.get('estAccordé') === 'true';

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
        await mediator.send<Lauréat.ConsulterCahierDesChargesChoisiQuery>({
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
        période,
      });

      const régionDreal = Option.isSome(utilisateur.région) ? utilisateur.région : undefined;
      const type = 'actionnaire';

      const refPotentiel = formatIdentifiantProjetForDocument(identifiantProjet);
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
          titrePeriode: période.title || '',
          unitePuissance: appelOffres.unitePuissance,
          enCopies: getEnCopies(candidature.localité.région),
          nouvelActionnaire: demandeDeChangement.demande.nouvelActionnaire,
          referenceParagrapheActionnaire: texteChangementDActionnariat.référenceParagraphe,
          contenuParagrapheActionnaire: texteChangementDActionnariat?.dispositions,
          estAccordé,
        },
      });

      return new Response(content, {
        headers: getDocxDocumentHeader({ identifiantProjet, nomProjet: candidature.nom, type }),
      });
    }),
  );

const getDonnéesCourriersRéponse = ({
  appelOffres,
  période,
  cahierDesChargesChoisi,
}: {
  appelOffres: AppelOffre.AppelOffreReadModel;
  période: AppelOffre.Periode;
  cahierDesChargesChoisi: Lauréat.ConsulterCahierDesChargesChoisiReadmodel;
}): AppelOffre.DonnéesCourriersRéponse['texteChangementDActionnariat'] => {
  return {
    référenceParagraphe: '!!!REFERENCE NON DISPONIBLE!!!',
    dispositions: '!!!CONTENU NON DISPONIBLE!!!',
    ...appelOffres.donnéesCourriersRéponse.texteChangementDActionnariat,
    ...période?.donnéesCourriersRéponse?.texteChangementDActionnariat,
    ...(cahierDesChargesChoisi.type === 'initial'
      ? {}
      : cahierDesChargesChoisi.donnéesCourriersRéponse?.texteChangementDActionnariat),
  };
};
