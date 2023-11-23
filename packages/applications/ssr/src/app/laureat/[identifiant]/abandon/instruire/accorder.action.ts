'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';
import { Abandon } from '@potentiel-domain/laureat';
import { FormAction, FormState, formAction } from '@/utils/formAction';
import { mapToReadableStream } from '@/utils/mapToReadableStream';

export type AccorderAbandonState = FormState;

const schema = zod.object({
  identifiantProjet: zod.string(),
  utilisateur: zod.string().email(),
  reponseSignee: zod
    .instanceof(Blob)
    .refine((data) => data.size > 0, {
      message: 'Vous devez joindre une réponse signée.',
    })
    .optional(),
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
    réponseSignéeValue = buildReponseSignee();
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

  const props: RéponseAbandonAvecRecandidatureProps = {
    dateCourrier: new Date().toISOString(),
    projet: {
      potentielId: projet.potentielIdentifier,
      nomReprésentantLégal: projet.nomReprésentantLégal,
      nomCandidat: projet.nomCandidat,
      email: projet.email,
      nom: projet.nom,
      commune: projet.localité.commune,
      codePostal: projet.localité.codePostal,
      dateDésignation: projet.dateDésignation,
      puissance: projet.puissance,
    },
    appelOffre: {
      nom: appelOffre.shortTitle,
      description: appelOffre.title,
      période: période.title ?? projet.période,
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

  const content = recandidature
    ? await mapToReadableStream(await buildDocument(props))
    : reponseSignee.stream();
  const mimeType = 'application/pdf';

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

type RéponseAbandonAvecRecandidatureProps = {
  dateCourrier: string;
  projet: {
    potentielId: string;
    nomReprésentantLégal: string;
    nomCandidat: string;
    email: string;
    nom: string;
    commune: string;
    codePostal: string;
    dateDésignation: string;
    puissance: number;
  };
  appelOffre: {
    nom: string;
    description: string;
    période: string;
    unitéPuissance: string;
    texteEngagementRéalisationEtModalitésAbandon: {
      référenceParagraphe: string;
      dispositions: string;
    };
  };
  demandeAbandon: {
    date: string;
    instructeur: {
      nom: string;
      fonction: string;
    };
  };
};

const buildReponseSignee = (abandon: Abandon.ConsulterAbandonReadModel) => {};
