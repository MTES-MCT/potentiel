import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';
import { NextRequest } from 'next/server';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Lauréat } from '@potentiel-domain/projet';
import { ModèleRéponseSignée } from '@potentiel-applications/document-builder';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { apiAction } from '@/utils/apiAction';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getPériodeAppelOffres } from '@/app/_helpers/getPériodeAppelOffres';
import { getCandidature } from '@/app/candidatures/_helpers/getCandidature';
import { mapLauréatToModèleRéponsePayload } from '@/utils/modèle-document/mapToModèleRéponsePayload';
import { getDocxDocumentHeader } from '@/utils/modèle-document/getDocxDocumentHeader';
import { getEnCopies } from '@/utils/modèle-document/getEnCopies';

import { getLauréat } from '../../../_helpers/getLauréat';

export const GET = async (
  request: NextRequest,
  { params: { identifiant } }: IdentifiantParameter,
) =>
  apiAction(() =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = decodeParameter(identifiant);
      const estAccordé = request.nextUrl.searchParams.get('estAccordé') === 'true';

      const { actionnaire, lauréat, puissance, représentantLégal } = await getLauréat({
        identifiantProjet,
      });
      const candidature = await getCandidature(identifiantProjet);

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

      if (Option.isNone(actionnaire) || !actionnaire.dateDemandeEnCours) {
        return notFound();
      }

      if (!actionnaire.dateDemandeEnCours) {
        return notFound();
      }

      const demandeDeChangement =
        await mediator.send<Lauréat.Actionnaire.ConsulterChangementActionnaireQuery>({
          type: 'Lauréat.Actionnaire.Query.ConsulterChangementActionnaire',
          data: { identifiantProjet, demandéLe: actionnaire.dateDemandeEnCours.formatter() },
        });

      if (Option.isNone(demandeDeChangement)) {
        return notFound();
      }

      const texteChangementDActionnariat = getDonnéesCourriersRéponse({
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

      const type = 'actionnaire';
      const content = await ModèleRéponseSignée.générerModèleRéponseAdapter({
        type,
        logo,
        data: {
          ...data,
          dateDemande: demandeDeChangement.demande.demandéeLe.formatter(),
          justificationDemande: demandeDeChangement.demande.raison,
          enCopies: getEnCopies(candidature.localité.région),
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

const getDonnéesCourriersRéponse = ({
  appelOffres,
  période,
  cahierDesChargesChoisi,
}: {
  appelOffres: AppelOffre.AppelOffreReadModel;
  période: AppelOffre.Periode;
  cahierDesChargesChoisi: Lauréat.ConsulterCahierDesChargesChoisiReadModel;
}): AppelOffre.DonnéesCourriersRéponse['texteChangementDActionnariat'] => {
  return {
    référenceParagraphe: '!!!REFERENCE NON DISPONIBLE!!!',
    dispositions: '!!!CONTENU NON DISPONIBLE!!!',
    ...appelOffres.donnéesCourriersRéponse.texteChangementDActionnariat,
    ...période?.donnéesCourriersRéponse?.texteChangementDActionnariat,
    ...(cahierDesChargesChoisi.type === 'initial'
      ? {}
      : cahierDesChargesChoisi.donnéesCourriersRéponse?.texteChangementDActionnariat),
  };
};
