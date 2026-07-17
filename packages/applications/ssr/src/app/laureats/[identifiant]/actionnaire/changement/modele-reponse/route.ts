import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';
import type { NextRequest } from 'next/server';

import { ModèleRéponseSignée } from '@potentiel-applications/document-builder';
import type { Lauréat } from '@potentiel-domain/projet';
import { AccèsFonctionnalitéRefuséError } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import { getCahierDesCharges, getLauréatInfos } from '@/app/_helpers';
import { apiAction } from '@/utils/apiAction';
import { decodeParameter } from '@/utils/decodeParameter';
import { getDocxDocumentHeader } from '@/utils/modèle-document/getDocxDocumentHeader';
import { getEnCopies } from '@/utils/modèle-document/getEnCopies';
import { mapLauréatToModèleRéponsePayload } from '@/utils/modèle-document/mapToModèleRéponsePayload';
import { withUtilisateur } from '@/utils/withUtilisateur';
import {
  getActionnaireInfos,
  getPuissanceInfos,
  getReprésentantLégalInfos,
} from '../../../_helpers';

export const GET = async (
  request: NextRequest,
  ctx: RouteContext<'/laureats/[identifiant]/actionnaire/changement/modele-reponse'>,
) =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      if (!utilisateur.rôle.aLaPermission('actionnaire.accorderChangement')) {
        throw new AccèsFonctionnalitéRefuséError(
          'actionnaire.accorderChangement',
          utilisateur.rôle.nom,
        );
      }
      if (!utilisateur.rôle.aLaPermission('actionnaire.rejeterChangement')) {
        throw new AccèsFonctionnalitéRefuséError(
          'actionnaire.rejeterChangement',
          utilisateur.rôle.nom,
        );
      }

      const { identifiant } = await ctx.params;
      const identifiantProjet = decodeParameter(identifiant);
      const estAccordé = request.nextUrl.searchParams.get('estAccordé') === 'true';

      const lauréat = await getLauréatInfos(identifiantProjet);
      const représentantLégal = await getReprésentantLégalInfos(identifiantProjet);
      const puissance = await getPuissanceInfos(identifiantProjet);
      const actionnaire = await getActionnaireInfos(identifiantProjet);
      const cahierDesCharges = await getCahierDesCharges(identifiantProjet);

      if (!actionnaire.dateDernièreDemande) {
        return notFound();
      }

      const demandeDeChangement =
        await mediator.send<Lauréat.Actionnaire.ConsulterChangementActionnaireQuery>({
          type: 'Lauréat.Actionnaire.Query.ConsulterChangementActionnaire',
          data: { identifiantProjet, demandéLe: actionnaire.dateDernièreDemande.formatter() },
        });

      if (Option.isNone(demandeDeChangement)) {
        return notFound();
      }

      const texteChangementDActionnariat =
        cahierDesCharges.getDonnéesCourriersRéponse('actionnaire');

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

      const type = 'actionnaire';
      const content = await ModèleRéponseSignée.générerModèleRéponseAdapter({
        type,
        logo,
        data: {
          ...data,
          dateDemande: demandeDeChangement.demande.demandéeLe.formatter(),
          justificationDemande: demandeDeChangement.demande.raison,
          enCopies: getEnCopies(lauréat.localité.région),
          nouvelActionnaire: demandeDeChangement.demande.nouvelActionnaire,
          referenceParagrapheActionnaire: texteChangementDActionnariat.référenceParagraphe,
          contenuParagrapheActionnaire: texteChangementDActionnariat?.dispositions,
          estAccordé,
        },
      });

      return new Response(content, {
        headers: getDocxDocumentHeader({ identifiantProjet, nomProjet: lauréat.nomProjet, type }),
      });
    }),
  );
