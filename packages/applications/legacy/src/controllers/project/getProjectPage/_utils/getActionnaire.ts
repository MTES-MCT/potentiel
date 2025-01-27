import { mediator } from 'mediateur';
import { Abandon, Actionnaire } from '@potentiel-domain/laureat';

import { Option } from '@potentiel-libraries/monads';
import { Candidature } from '@potentiel-domain/candidature';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { getAbandonStatut } from './getAbandon';
import { getAttestationDeConformité } from './getAttestationDeConformité';

export type GetActionnaireForProjectPage = {
  nom: string;
  affichage?: {
    label: string;
    url: string;
  };
  demandeEnCours?: {
    demandéeLe: string;
  };
};

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: string;
  demandeNécessiteInstruction: boolean;
};

export const getActionnaire = async ({
  identifiantProjet,
  rôle,
  demandeNécessiteInstruction,
}: Props): Promise<GetActionnaireForProjectPage | undefined> => {
  try {
    const utilisateur = Role.convertirEnValueType(rôle);

    const actionnaire = await mediator.send<Actionnaire.ConsulterActionnaireQuery>({
      type: 'Lauréat.Actionnaire.Query.ConsulterActionnaire',
      data: { identifiantProjet: identifiantProjet.formatter() },
    });

    const estAbandonnéOuEnCoursAbandonOuAchevé = await checkAbandonAndAchèvement(
      identifiantProjet,
      rôle,
    );

    const nePeutFaireAucuneAction =
      utilisateur.nom === 'porteur-projet' && estAbandonnéOuEnCoursAbandonOuAchevé;

    if (Option.isSome(actionnaire)) {
      const dateDemandeExistanteDeChangement =
        await mediator.send<Actionnaire.ConsulterDateChangementEnCoursActionnaireQuery>({
          type: 'Lauréat.Actionnaire.Query.ConsulterDateChangementEnCoursActionnaire',
          data: { identifiantProjet: identifiantProjet.formatter() },
        });

      const aUneDemandeEnCours = Option.isSome(dateDemandeExistanteDeChangement);

      const peutFaireUneDemandeDeChangement =
        demandeNécessiteInstruction &&
        utilisateur.aLaPermission('actionnaire.demanderChangement') &&
        !aUneDemandeEnCours;

      const peutModifier =
        !demandeNécessiteInstruction &&
        utilisateur.aLaPermission('actionnaire.modifier') &&
        !aUneDemandeEnCours;

      return {
        nom: actionnaire.actionnaire,
        affichage: nePeutFaireAucuneAction
          ? undefined
          : peutModifier
            ? {
                url: Routes.Actionnaire.modifier(identifiantProjet.formatter()),
                label: 'Modifier l’actionnariat',
              }
            : peutFaireUneDemandeDeChangement
              ? {
                  url: Routes.Actionnaire.changement.demander(identifiantProjet.formatter()),
                  label: "Demander une modification de l'actionnariat",
                }
              : undefined,
        demandeEnCours:
          utilisateur.aLaPermission('actionnaire.consulterChangement') && aUneDemandeEnCours
            ? {
                demandéeLe: dateDemandeExistanteDeChangement.formatter(),
              }
            : undefined,
      };
    }

    const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });

    if (Option.isSome(candidature)) {
      return {
        nom: candidature.sociétéMère,
        affichage: utilisateur.aLaPermission('candidature.corriger')
          ? {
              url: Routes.Candidature.corriger(identifiantProjet.formatter()),
              label: 'Modifier la candidature',
            }
          : undefined,
      };
    }

    return {
      nom: '',
    };
  } catch (error) {
    getLogger().error(error);
    return undefined;
  }
};

const checkAbandonAndAchèvement = async (
  identifiantProjet: Props['identifiantProjet'],
  rôle: Props['rôle'],
) => {
  const statutAbandon = await getAbandonStatut(identifiantProjet);
  const attestationConformitéExistante = await getAttestationDeConformité(identifiantProjet, rôle);

  return (
    (statutAbandon &&
      (Abandon.StatutAbandon.convertirEnValueType(statutAbandon.statut).estAccordé() ||
        Abandon.StatutAbandon.convertirEnValueType(statutAbandon.statut).estEnCours())) ||
    !!attestationConformitéExistante
  );
};
