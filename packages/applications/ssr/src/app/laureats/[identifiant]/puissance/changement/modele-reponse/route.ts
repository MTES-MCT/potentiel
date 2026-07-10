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
import { getReprésentantLégalInfos } from '../../../_helpers/getLauréat';

export const GET = async (
  request: NextRequest,
  ctx: RouteContext<'/laureats/[identifiant]/puissance/changement/modele-reponse'>,
) =>
  withUtilisateur(async (utilisateur) => {
    if (!utilisateur.rôle.aLaPermission('puissance.accorderChangement')) {
      throw new AccèsFonctionnalitéRefuséError(
        'puissance.accorderChangement',
        utilisateur.rôle.nom,
      );
    }
    if (!utilisateur.rôle.aLaPermission('puissance.rejeterChangement')) {
      throw new AccèsFonctionnalitéRefuséError('puissance.rejeterChangement', utilisateur.rôle.nom);
    }

    const { identifiant } = await ctx.params;
    const identifiantProjet = decodeParameter(identifiant);
    const estAccordé = request.nextUrl.searchParams.get('estAccordé') === 'true';

    const lauréat = await getLauréatInfos(identifiantProjet);
    const représentantLégal = await getReprésentantLégalInfos(identifiantProjet);

    const cahierDesCharges = await getCahierDesCharges(lauréat.identifiantProjet.formatter());

    const puissance = await mediator.send<Lauréat.Puissance.ConsulterPuissanceQuery>({
      type: 'Lauréat.Puissance.Query.ConsulterPuissance',
      data: { identifiantProjet },
    });

    if (
      Option.isNone(puissance) ||
      !puissance.aUneDemandeEnCours ||
      !puissance.dateDernièreDemande
    ) {
      return notFound();
    }

    const demandeDeChangement =
      await mediator.send<Lauréat.Puissance.ConsulterChangementPuissanceQuery>({
        type: 'Lauréat.Puissance.Query.ConsulterChangementPuissance',
        data: { identifiantProjet, demandéLe: puissance.dateDernièreDemande.formatter() },
      });

    if (Option.isNone(demandeDeChangement)) {
      return notFound();
    }

    const texteChangementDePuissance = cahierDesCharges.getDonnéesCourriersRéponse('puissance');

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

    const type = 'puissance';
    const content = await ModèleRéponseSignée.générerModèleRéponseAdapter({
      type,
      logo,
      data: {
        ...data,
        dateDemande: formatDateForDocument(demandeDeChangement.demande.demandéeLe.date),
        justificationDemande: demandeDeChangement.demande.raison ?? '',
        enCopies: getEnCopies(lauréat.localité.région),
        nouvellePuissance: demandeDeChangement.demande.nouvellePuissance.toString(),
        referenceParagraphePuissance: texteChangementDePuissance.référenceParagraphe,
        contenuParagraphePuissance: texteChangementDePuissance?.dispositions,
        puissanceActuelle: puissance.puissance.toString(),
        estAccordé,
      },
    });

    return new Response(content, {
      headers: getDocxDocumentHeader({ identifiantProjet, nomProjet: lauréat.nomProjet, type }),
    });
  });
