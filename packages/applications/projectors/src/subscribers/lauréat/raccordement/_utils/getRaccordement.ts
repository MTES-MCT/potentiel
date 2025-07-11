import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { findProjection } from '@potentiel-infrastructure/pg-projection-read';
import { Option } from '@potentiel-libraries/monads';

export const getRaccordement = async (
  identifiantProjet: IdentifiantProjet.RawType,
): Promise<Omit<Lauréat.Raccordement.RaccordementEntity, 'type'>> => {
  const raccordement = await findProjection<Lauréat.Raccordement.RaccordementEntity>(
    `raccordement|${identifiantProjet}`,
  );

  const raccordementDefaultValue: Omit<Lauréat.Raccordement.RaccordementEntity, 'type'> = {
    identifiantProjet,
    dossiers: [],
    identifiantGestionnaireRéseau:
      GestionnaireRéseau.IdentifiantGestionnaireRéseau.inconnu.formatter(),
  };

  return Option.isSome(raccordement) ? raccordement : raccordementDefaultValue;
};
