import Select, { SelectProps } from '@codegouvfr/react-dsfr/SelectNext';

import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { PlainType } from '@potentiel-domain/core';
import { Option } from '@potentiel-libraries/monads';
import { Lauréat } from '@potentiel-domain/projet';

export type GestionnaireRéseauSelectProps = {
  id: string;
  name: string;
  label?: string;
  disabled?: boolean;
  state?: SelectProps.State | 'default';
  stateRelatedMessage?: string;
  listeGestionnairesRéseau: PlainType<
    ReadonlyArray<Lauréat.Raccordement.ConsulterGestionnaireRéseauRaccordementReadModel>
  >;
  gestionnaireRéseauActuel: PlainType<
    Option.Type<Lauréat.Raccordement.ConsulterGestionnaireRéseauRaccordementReadModel>
  >;
  onGestionnaireRéseauSelected?: (
    identifiantGestionnaireRéseau: GestionnaireRéseau.IdentifiantGestionnaireRéseau.RawType,
  ) => void;
};

export const GestionnaireRéseauSelect = ({
  id,
  name,
  label = 'Gestionnaire réseau',
  disabled,
  state = 'default',
  stateRelatedMessage,
  listeGestionnairesRéseau,
  gestionnaireRéseauActuel,
  onGestionnaireRéseauSelected,
}: GestionnaireRéseauSelectProps) => {
  const defaultValue = Option.match(gestionnaireRéseauActuel)
    .some<string | undefined>((gestionnaire) => gestionnaire.identifiantGestionnaireRéseau.codeEIC)
    .none(() => undefined);
  const gestionnaireRéseauOptions = listeGestionnairesRéseau.map(
    ({ identifiantGestionnaireRéseau, raisonSociale }) => ({
      label: `${raisonSociale} (code EIC ou gestionnaire : ${identifiantGestionnaireRéseau.codeEIC})`,
      value: identifiantGestionnaireRéseau.codeEIC,
      key: identifiantGestionnaireRéseau.codeEIC,
    }),
  );

  return (
    <Select
      id={id}
      label={label}
      nativeSelectProps={{
        name,
        defaultValue,
        required: true,
        onChange: (e) => {
          const gestionnaireSélectionné = listeGestionnairesRéseau.find(
            (gestionnaire) =>
              gestionnaire.identifiantGestionnaireRéseau.codeEIC === e.currentTarget.value,
          );

          if (gestionnaireSélectionné && onGestionnaireRéseauSelected) {
            onGestionnaireRéseauSelected(
              gestionnaireSélectionné.identifiantGestionnaireRéseau.codeEIC,
            );
          }
        },
      }}
      placeholder="Sélectionnez un gestionnaire de réseau"
      options={gestionnaireRéseauOptions}
      state={state}
      stateRelatedMessage={stateRelatedMessage}
      disabled={disabled}
    />
  );
};
