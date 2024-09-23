import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { getLogger } from '@potentiel-libraries/monitoring';
import { ConsulterDocumentProjetQuery } from '@potentiel-domain/document';
import { Lauréat } from '@potentiel-domain/laureat';
import { Recours, Éliminé } from '@potentiel-domain/elimine';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { decodeParameter } from '@/utils/decodeParameter';

import { récupérerProjet } from '../../../_helpers';

// TODO: à supprimer pour utiliser directement Routes.Document.télécharger dans le front
// une fois qu'on aura migré la page Projet
const logger = getLogger();

export const GET = async (_: Request, { params: { identifiant } }: IdentifiantParameter) => {
  const identifiantProjet = decodeParameter(identifiant);

  const documentKey = await getDocumentKey(identifiantProjet);

  if (!documentKey) {
    logger.warn(`La clé de l'attestation n'existe pas`, { identifiantProjet });
    return notFound();
  }

  const result = await mediator.send<ConsulterDocumentProjetQuery>({
    type: 'Document.Query.ConsulterDocumentProjet',
    data: {
      documentKey,
    },
  });

  const { nom: nomProjet } = await récupérerProjet(identifiantProjet);

  return new Response(result.content, {
    headers: {
      'content-type': result.format,
      'content-disposition': `attachment; filename="attestation-${encodeURIComponent(nomProjet)}.pdf"`,
    },
  });
};

// TODO: devrait retourner un DocumentProject.ValutType, mais pas possible tant qu'on utilise recours legacy
const getDocumentKey = async (identifiantProjet: string): Promise<string | null> => {
  const lauréat = await mediator.send<Lauréat.ConsulterLauréatQuery>({
    type: 'Lauréat.Query.ConsulterLauréat',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isSome(lauréat)) {
    return lauréat.attestation.formatter();
  }

  const recours = await mediator.send<Recours.ConsulterDemandeRecoursLegacyQuery>({
    type: 'Éliminé.Recours.Query.ConsulterDemandeRecoursLegacy',
    data: {
      identifiantProjetValue: identifiantProjet,
    },
  });
  if (Option.isSome(recours)) {
    return recours.filename;
  }

  // TODO utiliser cette solution lorsque recours sera migré
  // const recours = await mediator.send<Recours.ConsulterRecoursQuery>({
  //   type: 'Eliminé.Recours.Query.ConsulterRecours',
  //   data: {
  //     identifiantProjetValue: identifiantProjet,
  //   },
  // });

  // if (Option.isSome(recours) && recours.demande.accord) {
  //   return recours.demande.accord.réponseSignée;
  // }

  const éliminé = await mediator.send<Éliminé.ConsulterÉliminéQuery>({
    type: 'Éliminé.Query.ConsulterÉliminé',
    data: {
      identifiantProjet,
    },
  });

  if (Option.isSome(éliminé)) {
    return éliminé.attestation.formatter();
  }

  return null;
};
