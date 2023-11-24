'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';
import { ConsulterAppelOffreQuery } from '@potentiel-domain/appel-offre';
import { Abandon } from '@potentiel-domain/laureat';
import { FormAction, FormState, formAction } from '@/utils/formAction';
import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { ConsulterUtilisateurQuery } from '@potentiel-domain/utilisateur';
import {
  GénérerRéponseAccordAbandonAvecRecandidaturePort,
  GénérerRéponseAccordAbandonAvecRecandidatureQuery,
} from '@potentiel-domain/document';

export type AccorderAbandonState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string(),
  utilisateur: zod.string().email(),
  reponseSignee: zod
    .instanceof(Blob)
    .optional()
    .refine(
      (data) => {
        if (!data) {
          return true;
        }
        return data.size > 0;
      },
      {
        message: 'Vous devez joindre une réponse signée.',
      },
    ),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet, reponseSignee, utilisateur },
) => {
  const abandon = await mediator.send<Abandon.ConsulterAbandonQuery>({
    type: 'CONSULTER_ABANDON_QUERY',
    data: {
      identifiantProjetValue: identifiantProjet,
    },
  });

  let réponseSignéeValue: Abandon.AccorderAbandonUseCase['data']['réponseSignéeValue'];

  if (abandon.demande.recandidature) {
    réponseSignéeValue = await buildReponseSignee(abandon, utilisateur);
  } else {
    if (!reponseSignee) {
      return {
        error: '',
        validationErrors: [],
      };
    }

    réponseSignéeValue = {
      content: reponseSignee.stream(),
      format: reponseSignee.type,
    };
  }

  await mediator.send<Abandon.AbandonUseCase>({
    type: 'ACCORDER_ABANDON_USECASE',
    data: {
      identifiantProjetValue: identifiantProjet,
      utilisateurValue: utilisateur,
      dateAccordValue: new Date().toISOString(),
      réponseSignéeValue,
    },
  });

  return previousState;
};

export const accorderAbandonAction = formAction(action, schema);

const buildReponseSignee = async (
  abandon: Abandon.ConsulterAbandonReadModel,
  identifiantUtilisateur: string,
): Promise<Abandon.AccorderAbandonUseCase['data']['réponseSignéeValue']> => {
  const projet = await mediator.send<ConsulterCandidatureQuery>({
    data: { identifiantProjet: abandon.identifiantProjet.formatter() },
    type: 'CONSULTER_CANDIDATURE_QUERY',
  });

  const appelOffre = await mediator.send<ConsulterAppelOffreQuery>({
    type: 'CONSULTER_APPEL_OFFRE_QUERY',
    data: {
      identifiantAppelOffre: projet.appelOffre,
    },
  });

  const utilisateur = await mediator.send<ConsulterUtilisateurQuery>({
    type: 'CONSULTER_UTILISATEUR_QUERY',
    data: {
      identifiantUtilisateur,
    },
  });

  const période = appelOffre.periodes.find((p) => p.id === projet.période);

  const props: Parameters<GénérerRéponseAccordAbandonAvecRecandidaturePort>[0] = {
    dateCourrier: new Date().toISOString(),
    projet: {
      identifiantProjet: abandon.identifiantProjet.formatter(),
      nomReprésentantLégal: projet.candidat.représentantLégal,
      nomCandidat: projet.candidat.nom,
      email: projet.candidat.contact,
      nom: projet.nom,
      commune: projet.localité.commune,
      codePostal: projet.localité.codePostal,
      dateDésignation: projet.dateDésignation,
      puissance: projet.puissance,
    },
    appelOffre: {
      nom: appelOffre.shortTitle,
      description: appelOffre.title,
      période: période?.title ?? projet.période,
      unitéPuissance: appelOffre.unitePuissance,
      texteEngagementRéalisationEtModalitésAbandon: appelOffre.donnéesCourriersRéponse
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

  const réponseSignée = await mediator.send<GénérerRéponseAccordAbandonAvecRecandidatureQuery>({
    type: 'GENERER_REPONSE_ACCORD_ABANDON_AVEC_RECANDIDATURE_QUERY',
    data: props,
  });

  return réponseSignée;
};
