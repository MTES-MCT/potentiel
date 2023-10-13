import { GestionnaireRéseauReadModel } from '@potentiel/domain-views';
import { Input, Select } from '@potentiel/ui';
import React, { ComponentProps } from 'react';

type GestionnaireRéseauSelectProps = ComponentProps<'select'> & {
  gestionnairesRéseau: ReadonlyArray<GestionnaireRéseauReadModel>;
  gestionnaireRéseauActuel?: GestionnaireRéseauReadModel;
  onGestionnaireRéseauSelected?: (gestionnaireRéseau: GestionnaireRéseauReadModel) => void;
};

export const GestionnaireRéseauSelect = ({
  gestionnairesRéseau,
  gestionnaireRéseauActuel,
  onGestionnaireRéseauSelected,
  ...props
}: GestionnaireRéseauSelectProps) => {
  const handleGestionnaireSéléctionné = (codeEIC: string) => {
    const gestionnaireSélectionné = gestionnairesRéseau?.find(
      (gestionnaire) => gestionnaire.codeEIC === codeEIC,
    );

    if (
      gestionnaireSélectionné &&
      gestionnaireSélectionné.codeEIC !== gestionnaireRéseauActuel?.codeEIC
    ) {
      onGestionnaireRéseauSelected && onGestionnaireRéseauSelected(gestionnaireSélectionné);
    }
  };

  return (
    <>
      <Select
        {...props}
        onChange={(e) => handleGestionnaireSéléctionné(e.currentTarget.value)}
        defaultValue={gestionnaireRéseauActuel?.codeEIC ?? ''}
      >
        <option value="">Sélectionnez votre gestionnaire de réseau</option>
        {gestionnairesRéseau.map(({ codeEIC, raisonSociale }) => (
          <option value={codeEIC} key={codeEIC}>
            {raisonSociale} (code EIC ou gestionnaire : {codeEIC})
          </option>
        ))}
      </Select>
      {props.disabled && (
        <Input name={props.name} hidden value={gestionnaireRéseauActuel?.codeEIC} />
      )}
    </>
  );
};
