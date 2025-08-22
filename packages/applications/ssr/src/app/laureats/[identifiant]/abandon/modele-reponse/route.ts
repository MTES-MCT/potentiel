import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import {
  formatDateForDocument,
  ModèleRéponseSignée,
} from '@potentiel-applications/document-builder';
import type { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { getCahierDesCharges } from '@/app/_helpers';
import { apiAction } from '@/utils/apiAction';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { getDocxDocumentHeader } from '@/utils/modèle-document/getDocxDocumentHeader';
import { getEnCopies } from '@/utils/modèle-document/getEnCopies';
import { mapLauréatToModèleRéponsePayload } from '@/utils/modèle-document/mapToModèleRéponsePayload';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getLauréat } from '../../_helpers/getLauréat';

export const GET = async (_: Request, { params: { identifiant } }: IdentifiantParameter) =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);

      const { lauréat, puissance, représentantLégal } = await getLauréat({
        identifiantProjet,
      });

      const abandon = await mediator.send<Lauréat.Abandon.ConsulterAbandonQuery>({
        type: 'Lauréat.Abandon.Query.ConsulterAbandon',
        data: {
          identifiantProjetValue: identifiantProjet,
        },
      });

      if (Option.isNone(abandon)) {
        return notFound();
      }

      const cahierDesCharges = await getCahierDesCharges(lauréat.identifiantProjet);

      const { logo, data } = mapLauréatToModèleRéponsePayload({
        identifiantProjet,
        lauréat,
        puissance,
        représentantLégal,
        appelOffres: cahierDesCharges.appelOffre,
        période: cahierDesCharges.période,
        famille: cahierDesCharges.famille,
        utilisateur,
      });

      const dispositionCDC = cahierDesCharges.getDonnéesCourriersRéponse('abandon');

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
          enCopies: getEnCopies(lauréat.localité.région),
        },
      });

      return new Response(content, {
        headers: getDocxDocumentHeader({ identifiantProjet, nomProjet: lauréat.nomProjet, type }),
      });
    }),
  );
