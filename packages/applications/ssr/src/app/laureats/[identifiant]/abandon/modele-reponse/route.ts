import {
  formatDateForDocument,
  ModèleRéponseSignée,
} from '@potentiel-applications/document-builder';
import { AccèsFonctionnalitéRefuséError } from '@potentiel-domain/utilisateur';

import { getCahierDesCharges, getLauréatInfos } from '@/app/_helpers';
import { apiAction } from '@/utils/apiAction';
import { decodeParameter } from '@/utils/decodeParameter';
import { getDocxDocumentHeader } from '@/utils/modèle-document/getDocxDocumentHeader';
import { getEnCopies } from '@/utils/modèle-document/getEnCopies';
import { mapLauréatToModèleRéponsePayload } from '@/utils/modèle-document/mapToModèleRéponsePayload';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  getDemandeAbandonEnCours,
  getPuissanceInfos,
  getReprésentantLégalInfos,
} from '../../_helpers/getLauréat';

export const GET = async (
  _: Request,
  ctx: RouteContext<'/laureats/[identifiant]/abandon/modele-reponse'>,
) =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      if (!utilisateur.rôle.aLaPermission('abandon.accorder')) {
        throw new AccèsFonctionnalitéRefuséError('abandon.accorder', utilisateur.rôle.nom);
      }

      if (!utilisateur.rôle.aLaPermission('abandon.rejeter')) {
        throw new AccèsFonctionnalitéRefuséError('abandon.rejeter', utilisateur.rôle.nom);
      }

      if (!utilisateur.rôle.aLaPermission('abandon.demander-confirmation')) {
        throw new AccèsFonctionnalitéRefuséError(
          'abandon.demander-confirmation',
          utilisateur.rôle.nom,
        );
      }

      const { identifiant } = await ctx.params;
      const identifiantProjet = decodeParameter(identifiant);
      const abandon = await getDemandeAbandonEnCours(identifiantProjet);

      const lauréat = await getLauréatInfos(identifiantProjet);
      const puissance = await getPuissanceInfos(identifiantProjet);
      const représentantLégal = await getReprésentantLégalInfos(identifiantProjet);
      const cahierDesCharges = await getCahierDesCharges(identifiantProjet);

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
          aprèsConfirmation: !!abandon.demande.confirmation?.confirméLe,
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
