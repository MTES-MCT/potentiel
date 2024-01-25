import Input from '@codegouvfr/react-dsfr/Input';
import Select, { SelectProps } from '@codegouvfr/react-dsfr/SelectNext';
import React from 'react';

export type GestionnaireRéseauSelectProps = {
  id: string;
  name: string;
  label?: string;
  disabled?: true;
  state: SelectProps.State | 'default';
  stateRelatedMessage?: string;
  gestionnairesRéseau: ReadonlyArray<{
    identifiantGestionnaireRéseau: string;
    codeEIC: string;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: {
      format: string;
      légende: string;
      expressionReguliere: string;
    };
  }>;
  identifiantGestionnaireRéseauActuel?: string;
  onGestionnaireRéseauSelected?: (gestionnaireRéseau: {
    identifiantGestionnaireRéseau: string;
    codeEIC: string;
    raisonSociale: string;
    aideSaisieRéférenceDossierRaccordement: {
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
          disabled,
          defaultValue: identifiantGestionnaireRéseauActuel,
          onChange: (e) => handleGestionnaireSéléctionné(e.currentTarget.value),
        }}
        placeholder="Sélectionnez votre gestionnaire de réseau"
        options={gestionnairesRéseau.map(
          ({ identifiantGestionnaireRéseau, codeEIC, raisonSociale }) => ({
            label: `${raisonSociale} (code EIC ou gestionnaire : ${codeEIC})`,
            value: identifiantGestionnaireRéseau,
            key: identifiantGestionnaireRéseau,
          }),
        )}
        state={state}
        stateRelatedMessage={stateRelatedMessage}
      />

      {disabled && (
        <Input
          hideLabel={true}
          label="Gestionnaire réseau"
          nativeInputProps={{
            type: 'hidden',
            name,
            value: identifiantGestionnaireRéseauActuel,
          }}
        />
      )}
    </div>
  );
};
