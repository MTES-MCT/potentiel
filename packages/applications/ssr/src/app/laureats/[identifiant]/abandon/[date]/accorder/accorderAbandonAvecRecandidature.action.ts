'use server';

import { mediator } from 'mediateur';
import * as zod from 'zod';

import { buildDocument, type DonnéesDocument } from '@potentiel-applications/document-builder';
import { Routes } from '@potentiel-applications/routes';
import { DateTime } from '@potentiel-domain/common';
import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import type { Utilisateur } from '@potentiel-domain/utilisateur';

import { getCandidature, getLauréatInfos, getPériodeAppelOffres } from '@/app/_helpers';
import {
  getPuissanceInfos,
  getReprésentantLégalInfos,
} from '@/app/laureats/[identifiant]/_helpers';
import { type FormAction, type FormState, formAction } from '@/utils/formAction';
import { withUtilisateur } from '@/utils/withUtilisateur';

const schema = zod.object({
  identifiantProjet: zod.string().min(1),
  dateDemande: zod.string().min(1),
});

const action: FormAction<FormState, typeof schema> = async (
  _,
  { identifiantProjet, dateDemande },
) =>
  withUtilisateur(async (utilisateur) => {
    if (!utilisateur.estValidateur()) {
      throw new Error('Utilisateur non autorisé à accorder un abandon.');
    }

    const réponseSignéeValue = await buildReponseSignee({
      utilisateur,
      dateDemandeAbandon: DateTime.convertirEnValueType(dateDemande),
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
    });

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
        url: Routes.Abandon.détailRedirection(identifiantProjet),
      },
    };
  });

export const accorderAbandonAvecRecandidatureAction = formAction(action, schema);

type BuildResponseSigneeProps = {
  utilisateur: Omit<Utilisateur.RôleDgecValidateurPayload, 'rôle'>;
  identifiantProjet: IdentifiantProjet.ValueType;
  dateDemandeAbandon: DateTime.ValueType;
};
const buildReponseSignee = async ({
  utilisateur,
  dateDemandeAbandon,
  identifiantProjet,
}: BuildResponseSigneeProps): Promise<
  Lauréat.Abandon.AccorderAbandonUseCase['data']['réponseSignéeValue']
> => {
  const candidature = await getCandidature(identifiantProjet.formatter());
  const lauréat = await getLauréatInfos(identifiantProjet.formatter());
  const représentantLégal = await getReprésentantLégalInfos(identifiantProjet.formatter());
  const puissance = await getPuissanceInfos(identifiantProjet.formatter());

  const { appelOffres, période } = await getPériodeAppelOffres(identifiantProjet.formatter());

  const props: DonnéesDocument = {
    dateCourrier: new Date().toISOString(),
    projet: {
      identifiantProjet: formatIdentifiantProjetForDocument(identifiantProjet),
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
      date: dateDemandeAbandon.date.toISOString(),
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
