import { mediator } from 'mediateur';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';
import { Role } from '@potentiel-domain/utilisateur';
import { Routes } from '@potentiel-applications/routes';
import { Lauréat } from '@potentiel-domain/projet';
import { DateTime } from '@potentiel-domain/common';

import { ChampAvecAction } from '../../_helpers/types';

type GetRaccordementProps = {
  role: Role.ValueType;
  identifiantProjet: IdentifiantProjet.ValueType;
  estAbandonné: boolean;
  aUnAbandonEnCours: boolean;
};

export type GetRaccordementForProjectPage = ChampAvecAction<
  | {
      nombreDeDossiers: number;
      gestionnaireDeRéseau: string;
      dateMiseEnService?: DateTime.ValueType;
    }
  | undefined
>;

export const getRaccordementData = async ({
  role,
  identifiantProjet,
  aUnAbandonEnCours,
  estAbandonné,
}: GetRaccordementProps): Promise<GetRaccordementForProjectPage> => {
  if (!role.aLaPermission('raccordement.consulter')) {
    return {
      value: undefined,
    };
  }

  const raccordement = await mediator.send<Lauréat.Raccordement.ConsulterRaccordementQuery>({
    type: 'Lauréat.Raccordement.Query.ConsulterRaccordement',
    data: { identifiantProjetValue: identifiantProjet.formatter() },
  });

  const gestionnaireRéseau =
    await mediator.send<Lauréat.Raccordement.ConsulterGestionnaireRéseauRaccordementQuery>({
      type: 'Lauréat.Raccordement.Query.ConsulterGestionnaireRéseauRaccordement',
      data: { identifiantProjetValue: identifiantProjet.formatter() },
    });

  const value = Option.isNone(raccordement)
    ? undefined
    : {
        nombreDeDossiers: raccordement.dossiers.length,
        gestionnaireDeRéseau: Option.isSome(gestionnaireRéseau)
          ? gestionnaireRéseau.raisonSociale
          : 'Aucun gestionnaire de réseau pour ce projet',
        dateMiseEnService: raccordement.dossiers.length
          ? raccordement.dossiers
              .map((dossier) => dossier.miseEnService?.dateMiseEnService)
              .filter(Boolean)
              .sort()[0]
          : undefined,
      };

  const action =
    estAbandonné || aUnAbandonEnCours
      ? undefined
      : role.aLaPermission('raccordement.demande-complète-raccordement.transmettre')
        ? {
            label: 'Renseigner les données de raccordement',
            url: Routes.Raccordement.détail(identifiantProjet.formatter()),
          }
        : {
            label: role.aLaPermission('raccordement.gestionnaire.modifier')
              ? 'Consulter ou modifier les documents'
              : 'Consulter les documents',
            url: Routes.Raccordement.détail(identifiantProjet.formatter()),
          };

  return {
    value,
    action,
  };
};
