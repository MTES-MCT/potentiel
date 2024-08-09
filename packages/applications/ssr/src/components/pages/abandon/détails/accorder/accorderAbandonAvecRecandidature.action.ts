'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';
import { notFound } from 'next/navigation';

import { ConsulterAppelOffreQuery } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/candidature';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { Abandon } from '@potentiel-domain/laureat';
import { ConsulterUtilisateurQuery } from '@potentiel-domain/utilisateur';
import { buildDocument, DonnéesDocument } from '@potentiel-applications/document-builder';
import { Option } from '@potentiel-libraries/monads';

import { FormAction, formAction, FormState } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (
  previousState,
  { identifiantProjet },
) => {
  return withUtilisateur(async (utilisateur) => {
    const abandon = await mediator.send<Abandon.ConsulterAbandonQuery>({
      type: 'Lauréat.Abandon.Query.ConsulterAbandon',
      data: {
        identifiantProjetValue: identifiantProjet,
      },
    });

    if (Option.isNone(abandon)) {
      return notFound();
    }

    const réponseSignéeValue = await buildReponseSignee(
      abandon,
      utilisateur.identifiantUtilisateur.formatter(),
    );

    await mediator.send<Abandon.AbandonUseCase>({
      type: 'Lauréat.Abandon.UseCase.AccorderAbandon',
      data: {
        identifiantProjetValue: identifiantProjet,
        identifiantUtilisateurValue: utilisateur.identifiantUtilisateur.formatter(),
        dateAccordValue: new Date().toISOString(),
        réponseSignéeValue,
      },
    });

    return {
      status: 'success',
    };
  });
};

export const accorderAbandonAvecRecandidatureAction = formAction(action, schema);

const buildReponseSignee = async (
  abandon: Abandon.ConsulterAbandonReadModel,
  identifiantUtilisateur: string,
): Promise<Abandon.AccorderAbandonUseCase['data']['réponseSignéeValue']> => {
  const candidature = await mediator.send<Candidature.ConsulterProjetQuery>({
    data: { identifiantProjet: abandon.identifiantProjet.formatter() },
    type: 'Candidature.Query.ConsulterProjet',
  });

  if (Option.isNone(candidature)) {
    return notFound();
  }

  const appelOffre = await mediator.send<ConsulterAppelOffreQuery>({
    type: 'AppelOffre.Query.ConsulterAppelOffre',
    data: {
      identifiantAppelOffre: candidature.appelOffre,
    },
  });

  if (Option.isNone(appelOffre)) {
    return notFound();
  }

  const utilisateur = await mediator.send<ConsulterUtilisateurQuery>({
    type: 'Utilisateur.Query.ConsulterUtilisateur',
    data: {
      identifiantUtilisateur,
    },
  });

  if (Option.isNone(utilisateur)) {
    return notFound();
  }

  const période = appelOffre.periodes.find((p) => p.id === candidature.période);

  const props: DonnéesDocument = {
    dateCourrier: new Date().toISOString(),
    projet: {
      identifiantProjet: formatIdentifiantProjetForDocument(abandon.identifiantProjet),
      nomReprésentantLégal: candidature.candidat.représentantLégal,
      nomCandidat: candidature.candidat.nom,
      email: candidature.candidat.contact,
      nom: candidature.nom,
      commune: candidature.localité.commune,
      codePostal: candidature.localité.codePostal,
      dateDésignation: candidature.dateDésignation,
      puissance: candidature.puissance,
    },
    appelOffre: {
      nom: appelOffre.shortTitle,
      description: appelOffre.title,
      période: période?.title ?? candidature.période,
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

const formatIdentifiantProjetForDocument = (
  identifiantProjet: IdentifiantProjet.ValueType,
): string => {
  const { appelOffre, période, famille, numéroCRE } = identifiantProjet;

  return `${appelOffre}-P${période}${famille ? `-F${famille}` : ''}-${numéroCRE}`;
};
