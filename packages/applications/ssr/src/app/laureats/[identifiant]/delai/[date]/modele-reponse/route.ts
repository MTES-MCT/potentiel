import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';
import { NextRequest } from 'next/server';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import {
  formatDateForDocument,
  ModèleRéponseSignée,
} from '@potentiel-applications/document-builder';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getCahierDesCharges, getPériodeAppelOffres } from '@/app/_helpers';
import { getEnCopies } from '@/utils/modèle-document/getEnCopies';
import { getDocxDocumentHeader } from '@/utils/modèle-document/getDocxDocumentHeader';
import { mapLauréatToModèleRéponsePayload } from '@/utils/modèle-document/mapToModèleRéponsePayload';

import { getLauréat } from '../../../_helpers/getLauréat';

type RouteProps = { params: { identifiant: string; date: string } };

export const GET = async (request: NextRequest, { params: { identifiant, date } }: RouteProps) =>
  withUtilisateur(async (utilisateur) => {
    const identifiantProjet = decodeParameter(identifiant);
    const demandéLe = decodeParameter(date);

    const { lauréat, représentantLégal, puissance } = await getLauréat({ identifiantProjet });
    const { appelOffres, période, famille } = await getPériodeAppelOffres(
      IdentifiantProjet.convertirEnValueType(identifiantProjet),
    );

    const cahierDesChargesChoisi = await getCahierDesCharges(identifiantProjet);

    const achèvement = await mediator.send<Lauréat.Achèvement.ConsulterAchèvementQuery>({
      type: 'Lauréat.Achèvement.Query.ConsulterAchèvement',
      data: { identifiantProjetValue: identifiantProjet },
    });

    if (Option.isNone(achèvement)) {
      return notFound();
    }

    const demandeDélai = await mediator.send<Lauréat.Délai.ConsulterDemandeDélaiQuery>({
      type: 'Lauréat.Délai.Query.ConsulterDemandeDélai',
      data: { identifiantProjet, demandéLe },
    });

    if (Option.isNone(demandeDélai)) {
      return notFound();
    }

    const texteDélaisDAchèvement = getDonnéesCourriersRéponse({
      appelOffres,
      cahierDesChargesChoisi,
      période,
    });

    const { logo, data } = mapLauréatToModèleRéponsePayload({
      identifiantProjet,
      lauréat,
      puissance,
      représentantLégal,
      appelOffres,
      période,
      famille,
      utilisateur,
    });

    const getDélaiRéalisationEnMois = () => {
      if (appelOffres.multiplesTechnologies) {
        return appelOffres.délaiRéalisationEnMois[lauréat.technologie.type];
      }

      return appelOffres.délaiRéalisationEnMois;
    };

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
          lauréat.notifiéLe.ajouterNombreDeMois(getDélaiRéalisationEnMois()).date,
        ),
        demandePrecedente: '',
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
}): AppelOffre.DonnéesCourriersRéponse['texteDélaisDAchèvement'] => {
  return {
    référenceParagraphe: '!!!REFERENCE NON DISPONIBLE!!!',
    dispositions: '!!!CONTENU NON DISPONIBLE!!!',
    ...appelOffres.donnéesCourriersRéponse.texteDélaisDAchèvement,
    ...période?.donnéesCourriersRéponse?.texteDélaisDAchèvement,
    ...(cahierDesChargesChoisi.type === 'initial'
      ? {}
      : cahierDesChargesChoisi.donnéesCourriersRéponse?.texteDélaisDAchèvement),
  };
};
