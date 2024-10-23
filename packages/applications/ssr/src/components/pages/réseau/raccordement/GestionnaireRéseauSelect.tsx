import Select, { SelectProps } from '@codegouvfr/react-dsfr/SelectNext';

type GestionnaireRéseau = {
  identifiantGestionnaireRéseau: string;
  raisonSociale: string;
  aideSaisieRéférenceDossierRaccordement?: {
    format: string;
    légende: string;
    expressionReguliere: string;
  };
};

export type GestionnaireRéseauSelectProps = {
  id: string;
  name: string;
  label?: string;
  disabled?: true;
  state?: SelectProps.State | 'default';
  stateRelatedMessage?: string;
  listeGestionnairesRéseau: ReadonlyArray<GestionnaireRéseau>;
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
  listeGestionnairesRéseau,
  identifiantGestionnaireRéseauActuel,
  onGestionnaireRéseauSelected,
}: GestionnaireRéseauSelectProps) => {
  const gestionnaireRéseauOptions = listeGestionnairesRéseau.map(
    ({ identifiantGestionnaireRéseau, raisonSociale }) => ({
      label: `${raisonSociale} (code EIC ou gestionnaire : ${identifiantGestionnaireRéseau})`,
      value: identifiantGestionnaireRéseau,
      key: identifiantGestionnaireRéseau,
    }),
  );

  return (
    <Select
      id={id}
      label={label}
      nativeSelectProps={{
        name,
        defaultValue: identifiantGestionnaireRéseauActuel,
        onChange: (e) => {
          const gestionnaireSélectionné = listeGestionnairesRéseau.find(
            (gestionnaire) => gestionnaire.identifiantGestionnaireRéseau === e.currentTarget.value,
          );

          if (gestionnaireSélectionné && onGestionnaireRéseauSelected) {
            onGestionnaireRéseauSelected(gestionnaireSélectionné);
          }
        },
      }}
      placeholder="Sélectionnez votre gestionnaire de réseau"
      options={gestionnaireRéseauOptions}
      state={state}
      stateRelatedMessage={stateRelatedMessage}
      disabled={disabled}
    />
  );
};
