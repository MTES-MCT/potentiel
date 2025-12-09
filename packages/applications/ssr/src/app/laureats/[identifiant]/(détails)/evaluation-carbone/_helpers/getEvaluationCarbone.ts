import { mediator } from 'mediateur';

import { Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';

import { checkAutorisationChangement } from '../../../_helpers/checkAutorisationChangement';
import { ChampAvecAction } from '../../../_helpers/types';

export type GetFournisseurForProjectPage = ChampAvecAction<{
  évaluationCarboneSimplifiée: number;
  fournisseurs: Array<Lauréat.Fournisseur.Fournisseur.ValueType>;
}>;

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: Role.ValueType;
};

export const getÉvaluationCarbone = async ({
  identifiantProjet,
  rôle,
}: Props): Promise<GetFournisseurForProjectPage | undefined> => {
  const projection = await mediator.send<Lauréat.Fournisseur.ConsulterFournisseurQuery>({
    type: 'Lauréat.Fournisseur.Query.ConsulterFournisseur',
    data: { identifiantProjet: identifiantProjet.formatter() },
  });

  if (Option.isSome(projection)) {
    const { fournisseurs, évaluationCarboneSimplifiée } = projection;

    const { peutModifier, peutEnregistrerChangement } =
      await checkAutorisationChangement<'fournisseur'>({
        identifiantProjet,
        rôle,
        domain: 'fournisseur',
      });

    // TODO:
    // règle spécifique à AOS, à rapatrier dans les règles métier présentes dans les AO si besoin
    const estPetitPV = identifiantProjet.appelOffre === 'PPE2 - Petit PV Bâtiment';

    const action = estPetitPV
      ? undefined
      : peutModifier
        ? {
            url: Routes.Fournisseur.modifier(identifiantProjet.formatter()),
            label: 'Modifier',
            labelActions: 'Modifier le fournisseur',
          }
        : peutEnregistrerChangement
          ? {
              url: Routes.Fournisseur.changement.enregistrer(identifiantProjet.formatter()),
              label: 'Changer de fournisseur',
              labelActions: 'Changer de fournisseur',
            }
          : undefined;

    return {
      value: {
        fournisseurs,
        évaluationCarboneSimplifiée,
      },
      action,
    };
  }

  return undefined;
};
