'use server';

import { ConsulterAppelOffreQuery } from '@potentiel-domain/appel-offre';
import { ConsulterCandidatureQuery } from '@potentiel-domain/candidature';
import { Abandon } from '@potentiel-domain/laureat';
import { ConsulterUtilisateurQuery } from '@potentiel-domain/utilisateur';
import { buildDocument } from '@potentiel-infrastructure/document-builder';
import { mediator } from 'mediateur';
import * as zod from 'zod';

import { FormAction, formAction, FormState } from '@/utils/formAction';

const schema = zod.object({
  identifiantProjet: zod.string(),
  identifiantUtilisateur: zod.string().email(),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet, identifiantUtilisateur },
) => {
  const abandon = await mediator.send<Abandon.ConsulterAbandonQuery>({
    type: 'CONSULTER_ABANDON_QUERY',
    data: {
      identifiantProjetValue: identifiantProjet,
    },
  });

  const réponseSignéeValue = await buildReponseSignee(abandon, identifiantUtilisateur);

  await mediator.send<Abandon.AbandonUseCase>({
    type: 'ACCORDER_ABANDON_USECASE',
    data: {
      identifiantProjetValue: identifiantProjet,
      identifiantUtilisateurValue: identifiantUtilisateur,
      dateAccordValue: new Date().toISOString(),
      réponseSignéeValue,
    },
  });

  return previousState;
};

export const accorderAbandonAvecRecandidatureAction = formAction(action, schema);

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

  const props: Parameters<typeof buildDocument>[0] = {
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

  return {
    content: await buildDocument(props),
    format: 'application/pdf',
  };
};
