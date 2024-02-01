import React from 'react';
import Select, { SelectProps } from '@codegouvfr/react-dsfr/SelectNext';

export type GestionnaireRéseauSelectProps = {
  id: string;
  name: string;
  label?: string;
  disabled?: true;
  state?: SelectProps.State | 'default';
  stateRelatedMessage?: string;
  gestionnairesRéseau: ReadonlyArray<{
    identifiantGestionnaireRéseau: string;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement?: {
      format: string;
      légende: string;
      expressionReguliere: string;
    };
  }>;
  identifiantGestionnaireRéseauActuel?: string;
  onGestionnaireRéseauSelected?: (gestionnaireRéseau: {
    identifiantGestionnaireRéseau: string;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement?: {
      format: string;
      légende: string;
      expressionReguliere: string;
    };
  }) => void;
};

export const GestionnaireRéseauSelect = ({
  id,
  name,
  label = 'Gestionnaire réseau',
  disabled,
  state = 'default',
  stateRelatedMessage,
  gestionnairesRéseau,
  identifiantGestionnaireRéseauActuel,
  onGestionnaireRéseauSelected,
}: GestionnaireRéseauSelectProps) => {
  const handleGestionnaireSéléctionné = (identifiantGestionnaireRéseau: string) => {
    const gestionnaireSélectionné = gestionnairesRéseau?.find(
      (gestionnaire) =>
        gestionnaire.identifiantGestionnaireRéseau === identifiantGestionnaireRéseau,
    );

    if (
      gestionnaireSélectionné &&
      gestionnaireSélectionné.identifiantGestionnaireRéseau !== identifiantGestionnaireRéseauActuel
    ) {
      onGestionnaireRéseauSelected && onGestionnaireRéseauSelected(gestionnaireSélectionné);
    }
  };

  return (
    <div>
      <Select
        id={id}
        label={label}
        nativeSelectProps={{
          name,
          defaultValue: identifiantGestionnaireRéseauActuel,
          onChange: (e) => handleGestionnaireSéléctionné(e.currentTarget.value),
        }}
        placeholder="Sélectionnez votre gestionnaire de réseau"
        options={gestionnairesRéseau.map(({ identifiantGestionnaireRéseau, raisonSociale }) => ({
          label: `${raisonSociale} (code EIC ou gestionnaire : ${identifiantGestionnaireRéseau})`,
          value: identifiantGestionnaireRéseau,
          key: identifiantGestionnaireRéseau,
        }))}
        state={state}
        stateRelatedMessage={stateRelatedMessage}
        disabled={disabled}
      />

      {disabled && <input type="hidden" name={name} value={identifiantGestionnaireRéseauActuel} />}
    </div>
  );
};
