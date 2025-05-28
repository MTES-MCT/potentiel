import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import {
  formatDateForDocument,
  ModèleRéponseSignée,
} from '@potentiel-applications/document-builder';
import { Option } from '@potentiel-libraries/monads';

import { apiAction } from '@/utils/apiAction';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getPériodeAppelOffres } from '@/app/_helpers/getPériodeAppelOffres';
import { mapLauréatToModèleRéponsePayload } from '@/utils/modèle-document/mapToModèleRéponsePayload';
import { getCandidature } from '@/app/candidatures/_helpers/getCandidature';
import { getEnCopies } from '@/utils/modèle-document/getEnCopies';
import { getDocxDocumentHeader } from '@/utils/modèle-document/getDocxDocumentHeader';

import { getLauréat } from '../../_helpers/getLauréat';

export const GET = async (_: Request, { params: { identifiant } }: IdentifiantParameter) =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);

      const { lauréat, puissance, représentantLégal } = await getLauréat({ identifiantProjet });
      const candidature = await getCandidature(identifiantProjet);

      const abandon = await mediator.send<Lauréat.Abandon.ConsulterAbandonQuery>({
        type: 'Lauréat.Abandon.Query.ConsulterAbandon',
        data: {
          identifiantProjetValue: identifiantProjet,
        },
      });

      if (Option.isNone(abandon)) {
        return notFound();
      }

      const { appelOffres, période, famille } = await getPériodeAppelOffres(
        IdentifiantProjet.convertirEnValueType(identifiantProjet),
      );

      const cahierDesChargesChoisi =
        await mediator.send<Lauréat.ConsulterCahierDesChargesChoisiQuery>({
          type: 'Lauréat.CahierDesCharges.Query.ConsulterCahierDesChargesChoisi',
          data: { identifiantProjet },
        });

      if (Option.isNone(cahierDesChargesChoisi)) {
        return notFound();
      }

      const { logo, data } = mapLauréatToModèleRéponsePayload({
        identifiantProjet,
        lauréat,
        puissance,
        représentantLégal,
        candidature,
        appelOffres,
        période,
        famille,
        utilisateur,
      });

      const dispositionCDC = getCDCAbandonRefs({
        appelOffres,
        période,
        cahierDesChargesChoisi,
      });

      const type = 'abandon';
      const content = await ModèleRéponseSignée.générerModèleRéponseAdapter({
        type,
        logo,
        data: {
          ...data,
          dateDemande: formatDateForDocument(abandon.demande.demandéLe.date),
          justificationDemande: abandon.demande.raison,
          aprèsConfirmation: abandon.demande.confirmation?.confirméLe ? true : false,
          contenuParagrapheAbandon: dispositionCDC.dispositions,
          dateConfirmation: formatDateForDocument(abandon.demande.confirmation?.confirméLe?.date),
          dateDemandeConfirmation: formatDateForDocument(
            abandon.demande.confirmation?.demandéeLe.date,
          ),

          referenceParagrapheAbandon: dispositionCDC.référenceParagraphe,
          status: abandon.statut.statut,
          enCopies: getEnCopies(candidature.localité.région),
        },
      });

      return new Response(content, {
        headers: getDocxDocumentHeader({ identifiantProjet, nomProjet: lauréat.nomProjet, type }),
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
  cahierDesChargesChoisi: Lauréat.ConsulterCahierDesChargesChoisiReadModel;
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
