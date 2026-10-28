import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import {
  formatDateForDocument,
  ModèleRéponseSignée,
} from '@potentiel-applications/document-builder';
import { Lauréat } from '@potentiel-domain/projet';
import { AccèsFonctionnalitéRefuséError } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import { getCahierDesCharges, getLauréatInfos } from '@/app/_helpers';
import { decodeParameter } from '@/utils/decodeParameter';
import { getDocxDocumentHeader } from '@/utils/modèle-document/getDocxDocumentHeader';
import { getEnCopies } from '@/utils/modèle-document/getEnCopies';
import { mapLauréatToModèleRéponsePayload } from '@/utils/modèle-document/mapToModèleRéponsePayload';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getAchèvement, getPuissanceInfos, getReprésentantLégalInfos } from '../../../_helpers';

export const GET = async (
  request: Request,
  ctx: RouteContext<'/laureats/[identifiant]/delai/[date]/modele-reponse'>,
) =>
  withUtilisateur(async (utilisateur) => {
    if (!utilisateur.rôle.aLaPermission('délai.accorderDemande')) {
      throw new AccèsFonctionnalitéRefuséError('délai.accorderDemande', utilisateur.rôle.nom);
    }
    if (!utilisateur.rôle.aLaPermission('délai.rejeterDemande')) {
      throw new AccèsFonctionnalitéRefuséError('délai.rejeterDemande', utilisateur.rôle.nom);
    }

    const url = new URL(request.url);
    const motif =
      url.searchParams.get('motif') === 'prolongation-phase-essai'
        ? Lauréat.Délai.MotifDemandeDélai.prolongationPhaseEssai
        : Lauréat.Délai.MotifDemandeDélai.prolongationDélaiAchèvement;

    const { identifiant, date } = await ctx.params;
    const identifiantProjet = decodeParameter(identifiant);
    const demandéLe = decodeParameter(date);

    const lauréat = await getLauréatInfos(identifiantProjet);
    const représentantLégal = await getReprésentantLégalInfos(identifiantProjet);
    const puissance = await getPuissanceInfos(identifiantProjet);
    const cahierDesCharges = await getCahierDesCharges(identifiantProjet);

    const demandeDélai = await mediator.send<Lauréat.Délai.ConsulterDemandeDélaiQuery>({
      type: 'Lauréat.Délai.Query.ConsulterDemandeDélai',
      data: { identifiantProjet, demandéLe },
    });

    if (Option.isNone(demandeDélai)) {
      return notFound();
    }

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

    const commonData = {
      ...data,
      dateDemande: formatDateForDocument(new Date(demandéLe)),
      justificationDemande: demandeDélai.raison ?? '',
      enCopies: getEnCopies(lauréat.localité.région),
      nombreDeMoisDemandé: demandeDélai.nombreDeMois,
    };

    if (motif.estProlongationPhaseEssai()) {
      const type = 'délai-essais';
      const texteDélaiPhaseEssai = cahierDesCharges.getDonnéesCourriersRéponse('délaiPhaseEssai');

      const content = await ModèleRéponseSignée.générerModèleRéponseAdapter({
        type,
        logo,
        data: {
          ...commonData,
          referenceTexteDelaiPhaseEssai: texteDélaiPhaseEssai.référenceParagraphe,
          contenuTexteDelaiPhaseEssai: texteDélaiPhaseEssai.dispositions,
        },
      });
      return new Response(content, {
        headers: getDocxDocumentHeader({ identifiantProjet, nomProjet: lauréat.nomProjet, type }),
      });
    } else {
      const type = 'délai-achèvement';
      const texteDélaisDAchèvement = cahierDesCharges.getDonnéesCourriersRéponse('délaiAchèvement');
      const délaiRéalisationEnMois = cahierDesCharges.getDélaiRéalisationEnMois();
      const achèvement = await getAchèvement(identifiantProjet);
      const content = await ModèleRéponseSignée.générerModèleRéponseAdapter({
        type,
        logo,
        data: {
          ...commonData,
          contenuParagrapheAchevement: texteDélaisDAchèvement.dispositions,
          referenceParagrapheAchevement: texteDélaisDAchèvement.référenceParagraphe,
          dateAchèvementDemandée: formatDateForDocument(
            achèvement.dateAchèvementPrévisionnel.ajouterDélai(demandeDélai.nombreDeMois).dateTime
              .date,
          ),
          dateLimiteAchevementActuelle: achèvement.dateAchèvementPrévisionnel.formatterDate(),
          dateLimiteAchevementInitiale: formatDateForDocument(
            lauréat.notifiéLe.ajouterNombreDeMois(délaiRéalisationEnMois).date,
          ),
          demandePrecedente: '',
        },
      });
      return new Response(content, {
        headers: getDocxDocumentHeader({ identifiantProjet, nomProjet: lauréat.nomProjet, type }),
      });
    }
  });
