import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';
import { NextRequest } from 'next/server';

import {
  formatDateForDocument,
  ModèleRéponseSignée,
} from '@potentiel-applications/document-builder';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getCahierDesCharges } from '@/app/_helpers';
import { getEnCopies } from '@/utils/modèle-document/getEnCopies';
import { getDocxDocumentHeader } from '@/utils/modèle-document/getDocxDocumentHeader';
import { mapLauréatToModèleRéponsePayload } from '@/utils/modèle-document/mapToModèleRéponsePayload';

import { getLauréat } from '../../../_helpers/getLauréat';

export const GET = async (
  request: NextRequest,
  { params: { identifiant } }: IdentifiantParameter,
) =>
  withUtilisateur(async (utilisateur) => {
    const identifiantProjet = decodeParameter(identifiant);
    const estAccordé = request.nextUrl.searchParams.get('estAccordé') === 'true';

    const { lauréat, représentantLégal } = await getLauréat(
      IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
    );

    const cahierDesCharges = await getCahierDesCharges(lauréat.identifiantProjet.formatter());

    const puissance = await mediator.send<Lauréat.Puissance.ConsulterPuissanceQuery>({
      type: 'Lauréat.Puissance.Query.ConsulterPuissance',
      data: { identifiantProjet },
    });

    if (Option.isNone(puissance) || !puissance.dateDemandeEnCours) {
      return notFound();
    }

    const demandeDeChangement =
      await mediator.send<Lauréat.Puissance.ConsulterChangementPuissanceQuery>({
        type: 'Lauréat.Puissance.Query.ConsulterChangementPuissance',
        data: { identifiantProjet, demandéLe: puissance.dateDemandeEnCours.formatter() },
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
