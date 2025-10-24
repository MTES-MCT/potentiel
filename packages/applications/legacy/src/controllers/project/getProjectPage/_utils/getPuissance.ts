import { Lauréat } from '@potentiel-domain/projet';

import { Option } from '@potentiel-libraries/monads';
import { Routes } from '@potentiel-applications/routes';
import { Role } from '@potentiel-domain/utilisateur';
import { getLogger } from '@potentiel-libraries/monitoring';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mediator } from 'mediateur';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { checkAutorisationChangement } from './checkLauréat/checkAutorisationChangement';

export type GetPuissanceForProjectPage = {
  puissance: number;
  puissanceDeSite?: number;
  affichage?: {
    labelActions?: string;
    label: string;
    url: string;
  };
};

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: string;
  règlesChangementPourAppelOffres: AppelOffre.RèglesDemandesChangement['puissance'];
};

export const getPuissance = async ({
  identifiantProjet,
  rôle,
  règlesChangementPourAppelOffres,
}: Props): Promise<GetPuissanceForProjectPage | undefined> => {
  try {
    const role = Role.convertirEnValueType(rôle);

    const puissanceProjection = await mediator.send<Lauréat.Puissance.ConsulterPuissanceQuery>({
      type: 'Lauréat.Puissance.Query.ConsulterPuissance',
      data: { identifiantProjet: identifiantProjet.formatter() },
    });

    if (Option.isSome(puissanceProjection)) {
      const { puissance, dateDemandeEnCours, puissanceDeSite } = puissanceProjection;

      if (dateDemandeEnCours) {
        return {
          puissance,
          puissanceDeSite,
          affichage: role.aLaPermission('puissance.consulterChangement')
            ? {
                url: Routes.Puissance.changement.détails(
                  identifiantProjet.formatter(),
                  dateDemandeEnCours.formatter(),
                ),
                label: 'Voir la demande de modification',
                labelActions: 'Demande de modification de puissance',
              }
            : undefined,
        };
      }

      const { peutModifier, peutFaireUneDemandeDeChangement } =
        await checkAutorisationChangement<'puissance'>({
          rôle: Role.convertirEnValueType(rôle),
          identifiantProjet,
          règlesChangementPourAppelOffres,
          domain: 'puissance',
        });

      const affichage = peutModifier
        ? {
            url: Routes.Puissance.modifier(identifiantProjet.formatter()),
            label: 'Modifier',
            labelActions: 'Modifier la puissance',
          }
        : peutFaireUneDemandeDeChangement
          ? {
              url: Routes.Puissance.changement.demander(identifiantProjet.formatter()),
              label: 'Changer de puissance',
              labelActions: 'Changer de puissance',
            }
          : undefined;

      return {
        puissance,
        puissanceDeSite,
        affichage,
      };
    }

    return undefined;
  } catch (error) {
    getLogger().error(error);
    return undefined;
  }
};
