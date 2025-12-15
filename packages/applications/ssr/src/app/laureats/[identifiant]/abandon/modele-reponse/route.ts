import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Lauréat } from '@potentiel-domain/projet';
import {
  formatDateForDocument,
  ModèleRéponseSignée,
} from '@potentiel-applications/document-builder';
import { Option } from '@potentiel-libraries/monads';

import { apiAction } from '@/utils/apiAction';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getCahierDesCharges } from '@/app/_helpers';
import { mapLauréatToModèleRéponsePayload } from '@/utils/modèle-document/mapToModèleRéponsePayload';
import { getEnCopies } from '@/utils/modèle-document/getEnCopies';
import { getDocxDocumentHeader } from '@/utils/modèle-document/getDocxDocumentHeader';

import { getLauréat } from '../../_helpers/getLauréat';

export const GET = async (_: Request, { params: { identifiant } }: IdentifiantParameter) =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);

      const {
        lauréat,
        puissance,
        représentantLégal,
        abandon: abandonInfo,
      } = await getLauréat({
        identifiantProjet,
      });

      if (!abandonInfo) {
        return notFound();
      }

      const abandon = await mediator.send<Lauréat.Abandon.ConsulterDemandeAbandonQuery>({
        type: 'Lauréat.Abandon.Query.ConsulterDemandeAbandon',
        data: {
          identifiantProjetValue: identifiantProjet,
          demandéLeValue: abandonInfo.demandéLe.formatter(),
        },
      });

      if (Option.isNone(abandon)) {
        return notFound();
      }

      const cahierDesCharges = await getCahierDesCharges(lauréat.identifiantProjet.formatter());

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
