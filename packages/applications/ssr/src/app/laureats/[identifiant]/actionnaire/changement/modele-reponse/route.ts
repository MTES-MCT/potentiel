import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';
import { NextRequest } from 'next/server';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { ModèleRéponseSignée } from '@potentiel-applications/document-builder';
import { Option } from '@potentiel-libraries/monads';

import { apiAction } from '@/utils/apiAction';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getCahierDesCharges } from '@/app/_helpers';
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

      const { actionnaire, lauréat, puissance, représentantLégal } = await getLauréat(
        IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
      );

      const cahierDesCharges = await getCahierDesCharges(lauréat.identifiantProjet.formatter());

      if (Option.isNone(actionnaire) || !actionnaire.aUneDemandeEnCours) {
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
