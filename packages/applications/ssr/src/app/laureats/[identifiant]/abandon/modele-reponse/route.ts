import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Abandon, CahierDesCharges } from '@potentiel-domain/laureat';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/candidature';
import { DateTime, IdentifiantProjet } from '@potentiel-domain/common';
import {
  formatDateForDocument,
  ModèleRéponseSignée,
} from '@potentiel-applications/document-builder';
import { Option } from '@potentiel-libraries/monads';

import { apiAction } from '@/utils/apiAction';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { formatIdentifiantProjetForDocument } from '@/utils/modèle-document/formatIdentifiantProjetForDocument';
import { getPériodeAppelOffres } from '@/app/_helpers/getPériodeAppelOffres';
import { getEnCopies } from '@/utils/modèle-document/getEnCopies';
import { getDocxDocumentHeader } from '@/utils/modèle-document/getDocxDocumentHeader';

export const GET = async (_: Request, { params: { identifiant } }: IdentifiantParameter) =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);

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

      const { appelOffres, période } = await getPériodeAppelOffres(
        IdentifiantProjet.convertirEnValueType(identifiantProjet),
      );

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
        période,
        cahierDesChargesChoisi,
      });

      const type = 'abandon';

      const content = await ModèleRéponseSignée.générerModèleRéponseAdapter({
        type,
        data: {
          aprèsConfirmation: abandon.demande.confirmation?.confirméLe ? true : false,
          adresseCandidat: candidature.candidat.adressePostale,
          codePostalProjet: candidature.localité.codePostal,
          communeProjet: candidature.localité.commune,
          contenuParagrapheAbandon: dispositionCDC.dispositions,
          dateConfirmation: formatDateForDocument(abandon.demande.confirmation?.confirméLe?.date),
          dateDemande: formatDateForDocument(abandon.demande.demandéLe.date),
          dateDemandeConfirmation: formatDateForDocument(
            abandon.demande.confirmation?.demandéeLe.date,
          ),
          dateNotification: formatDateForDocument(
            DateTime.convertirEnValueType(candidature.dateDésignation).date,
          ),
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
          suiviPar: utilisateur.nom,
          suiviParEmail: appelOffres.dossierSuiviPar,
          titreAppelOffre: appelOffres.title,
          titreFamille: candidature.famille || '',
          titrePeriode: période.title || '',
          unitePuissance: appelOffres.unitePuissance,
          enCopies: getEnCopies(candidature.localité.région),
        },
      });

      return new Response(content, {
        headers: getDocxDocumentHeader({ identifiantProjet, nomProjet: candidature.nom, type }),
      });
    }),
  );

const getCDCAbandonRefs = ({
  appelOffres,
  période,
  cahierDesChargesChoisi,
}: {
  appelOffres: AppelOffre.AppelOffreReadModel;
  période: AppelOffre.Periode;
  cahierDesChargesChoisi: CahierDesCharges.ConsulterCahierDesChargesChoisiReadmodel;
}) => {
  const cahierDesChargesModifié =
    cahierDesChargesChoisi.type === 'modifié' &&
    période?.cahiersDesChargesModifiésDisponibles.find(
      (c) =>
        c.paruLe === cahierDesChargesChoisi.paruLe &&
        c.alternatif === cahierDesChargesChoisi.alternatif,
    );

  return {
    référenceParagraphe: '!!!REFERENCE NON DISPONIBLE!!!',
    dispositions: '!!!CONTENU NON DISPONIBLE!!!',
    ...appelOffres.donnéesCourriersRéponse.texteEngagementRéalisationEtModalitésAbandon,
    ...période?.donnéesCourriersRéponse?.texteEngagementRéalisationEtModalitésAbandon,
    ...(cahierDesChargesModifié &&
      cahierDesChargesModifié.donnéesCourriersRéponse
        ?.texteEngagementRéalisationEtModalitésAbandon),
  };
};
