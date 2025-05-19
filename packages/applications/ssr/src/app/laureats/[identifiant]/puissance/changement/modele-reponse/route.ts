import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';
import { NextRequest } from 'next/server';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import {
  formatDateForDocument,
  ModèleRéponseSignée,
} from '@potentiel-applications/document-builder';
import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getPériodeAppelOffres } from '@/app/_helpers/getPériodeAppelOffres';
import { getEnCopies } from '@/utils/modèle-document/getEnCopies';
import { getDocxDocumentHeader } from '@/utils/modèle-document/getDocxDocumentHeader';
import { getCandidature } from '@/app/candidatures/_helpers/getCandidature';
import { mapLauréatToModèleRéponsePayload } from '@/utils/modèle-document/mapToModèleRéponsePayload';

import { getLauréat } from '../../../_helpers/getLauréat';

export const GET = async (
  request: NextRequest,
  { params: { identifiant } }: IdentifiantParameter,
) =>
  withUtilisateur(async (utilisateur) => {
    const identifiantProjet = decodeParameter(identifiant);
    const estAccordé = request.nextUrl.searchParams.get('estAccordé') === 'true';

    const candidature = await getCandidature(identifiantProjet);
    const { lauréat, représentantLégal } = await getLauréat({ identifiantProjet });
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

    const texteChangementDePuissance = getDonnéesCourriersRéponse({
      appelOffres,
      cahierDesChargesChoisi,
      période,
    });

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

    const type = 'puissance';
    const content = await ModèleRéponseSignée.générerModèleRéponseAdapter({
      type,
      logo,
      data: {
        ...data,
        dateDemande: formatDateForDocument(demandeDeChangement.demande.demandéeLe.date),
        justificationDemande: demandeDeChangement.demande.raison ?? '',
        enCopies: getEnCopies(candidature.localité.région),
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

const getDonnéesCourriersRéponse = ({
  appelOffres,
  période,
  cahierDesChargesChoisi,
}: {
  appelOffres: AppelOffre.AppelOffreReadModel;
  période: AppelOffre.Periode;
  cahierDesChargesChoisi: Lauréat.ConsulterCahierDesChargesChoisiReadModel;
}): AppelOffre.DonnéesCourriersRéponse['texteChangementDePuissance'] => {
  return {
    référenceParagraphe: '!!!REFERENCE NON DISPONIBLE!!!',
    dispositions: '!!!CONTENU NON DISPONIBLE!!!',
    ...appelOffres.donnéesCourriersRéponse.texteChangementDePuissance,
    ...période?.donnéesCourriersRéponse?.texteChangementDePuissance,
    ...(cahierDesChargesChoisi.type === 'initial'
      ? {}
      : cahierDesChargesChoisi.donnéesCourriersRéponse?.texteChangementDePuissance),
  };
};
