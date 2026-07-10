import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';
import type { NextRequest } from 'next/server';

import {
  formatDateForDocument,
  ModèleRéponseSignée,
} from '@potentiel-applications/document-builder';
import type { Lauréat } from '@potentiel-domain/projet';
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
  _: NextRequest,
  ctx: RouteContext<'/laureats/[identifiant]/delai/[date]/modele-reponse'>,
) =>
  withUtilisateur(async (utilisateur) => {
    if (!utilisateur.rôle.aLaPermission('délai.accorderDemande')) {
      throw new AccèsFonctionnalitéRefuséError('délai.accorderDemande', utilisateur.rôle.nom);
    }
    if (!utilisateur.rôle.aLaPermission('délai.rejeterDemande')) {
      throw new AccèsFonctionnalitéRefuséError('délai.rejeterDemande', utilisateur.rôle.nom);
    }

    const { identifiant, date } = await ctx.params;
    const identifiantProjet = decodeParameter(identifiant);
    const demandéLe = decodeParameter(date);

    const lauréat = await getLauréatInfos(identifiantProjet);
    const représentantLégal = await getReprésentantLégalInfos(identifiantProjet);
    const puissance = await getPuissanceInfos(identifiantProjet);
    const cahierDesCharges = await getCahierDesCharges(identifiantProjet);
    const achèvement = await getAchèvement(identifiantProjet);

    const demandeDélai = await mediator.send<Lauréat.Délai.ConsulterDemandeDélaiQuery>({
      type: 'Lauréat.Délai.Query.ConsulterDemandeDélai',
      data: { identifiantProjet, demandéLe },
    });

    if (Option.isNone(demandeDélai)) {
      return notFound();
    }

    const texteDélaisDAchèvement = cahierDesCharges.getDonnéesCourriersRéponse('délai');

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

    const délaiRéalisationEnMois = cahierDesCharges.getDélaiRéalisationEnMois();

    const type = 'délai';
    const content = await ModèleRéponseSignée.générerModèleRéponseAdapter({
      type,
      logo,
      data: {
        ...data,
        dateDemande: formatDateForDocument(new Date(demandéLe)),
        justificationDemande: demandeDélai.raison ?? '',
        enCopies: getEnCopies(lauréat.localité.région),
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
        nombreDeMoisDemandé: demandeDélai.nombreDeMois,
      },
    });

    return new Response(content, {
      headers: getDocxDocumentHeader({ identifiantProjet, nomProjet: lauréat.nomProjet, type }),
    });
  });
