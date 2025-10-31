'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';
import { notFound } from 'next/navigation';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Utilisateur } from '@potentiel-domain/utilisateur';
import { buildDocument, DonnéesDocument } from '@potentiel-applications/document-builder';
import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getLauréat } from '@/app/laureats/[identifiant]/_helpers/getLauréat';
import { getPériodeAppelOffres, getCandidature } from '@/app/_helpers';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet },
) => {
  return withUtilisateur(async (utilisateur) => {
    const abandon = await mediator.send<Lauréat.Abandon.ConsulterAbandonQuery>({
      type: 'Lauréat.Abandon.Query.ConsulterAbandon',
      data: {
        identifiantProjetValue: identifiantProjet,
      },
    });

    if (Option.isNone(abandon)) {
      return notFound();
    }

    if (!utilisateur.estValidateur()) {
      throw new Error('Utilisateur non autorisé à accorder un abandon.');
    }

    const réponseSignéeValue = await buildReponseSignee(abandon, utilisateur);

    await mediator.send<Lauréat.Abandon.AbandonUseCase>({
      type: 'Lauréat.Abandon.UseCase.AccorderAbandon',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        rôleUtilisateurValue: utilisateur.rôle.nom,
        dateAccordValue: new Date().toISOString(),
        réponseSignéeValue,
      },
    });

    return {
      status: 'success',
      redirection: {
        url: Routes.Abandon.détail(identifiantProjet),
      },
    };
  });
};

export const accorderAbandonAvecRecandidatureAction = formAction(action, schema);

const buildReponseSignee = async (
  abandon: Lauréat.Abandon.ConsulterAbandonReadModel,
  utilisateur: Omit<Utilisateur.RôleDgecValidateurPayload, 'rôle'>,
): Promise<Lauréat.Abandon.AccorderAbandonUseCase['data']['réponseSignéeValue']> => {
  const identifiantProjet = abandon.identifiantProjet;
  const candidature = await getCandidature(identifiantProjet.formatter());
  const { lauréat, représentantLégal, puissance } = await getLauréat({
    identifiantProjet: identifiantProjet.formatter(),
  });
  const { appelOffres, période } = await getPériodeAppelOffres(identifiantProjet);

  const props: DonnéesDocument = {
    dateCourrier: new Date().toISOString(),
    projet: {
      identifiantProjet: formatIdentifiantProjetForDocument(abandon.identifiantProjet),
      nomReprésentantLégal: représentantLégal.nomReprésentantLégal,
      nomCandidat: candidature.dépôt.nomCandidat,
      email: candidature.dépôt.emailContact.formatter(),
      nom: lauréat.nomProjet,
      commune: candidature.dépôt.localité.commune,
      codePostal: candidature.dépôt.localité.codePostal,
      dateDésignation: lauréat.notifiéLe.formatter(),
      puissance: puissance.puissance,
      unitéPuissance: candidature.unitéPuissance.formatter(),
    },
    appelOffre: {
      nom: appelOffres.shortTitle,
      description: appelOffres.title,
      période: période.title,
      texteEngagementRéalisationEtModalitésAbandon: appelOffres.donnéesCourriersRéponse
        .texteEngagementRéalisationEtModalitésAbandon ?? {
        référenceParagraphe: '!!!REFERENCE NON DISPONIBLE!!!',
        dispositions: '!!!CONTENU NON DISPONIBLE!!!',
      },
    },
    demandeAbandon: {
      date: abandon.demande.demandéLe.date.toISOString(),
      instructeur: {
        nom: utilisateur.nomComplet,
        fonction: utilisateur.fonction,
      },
    },
  };

  return {
    content: await buildDocument(props),
    format: 'application/pdf',
  };
};

const formatIdentifiantProjetForDocument = (
  identifiantProjet: IdentifiantProjet.ValueType,
): string => {
  const { appelOffre, période, famille, numéroCRE } = identifiantProjet;

  return `${appelOffre}-P${période}${famille ? `-F${famille}` : ''}-${numéroCRE}`;
};
