import { match } from 'ts-pattern';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import Input from '@codegouvfr/react-dsfr/Input';

import { Role } from '@potentiel-domain/utilisateur';

type SpécificitésRoleInputProps = {
  rôle: Role.RawType;
  régions: { label: string; value: string }[];
  gestionnairesRéseau: { label: string; value: string }[];
  zones: { label: string; value: string }[];
  validationErrors: Partial<
    Record<'nomComplet' | 'fonction' | 'region' | 'identifiantGestionnaireReseau' | 'zone', string>
  >;
};

export const SpécificitésRoleInput = ({
  rôle,
  gestionnairesRéseau,
  régions,
  zones,
  validationErrors,
}: SpécificitésRoleInputProps) => {
  return match(rôle)
    .with('dgec-validateur', () => (
      <>
        <Input
          label="Nom Complet"
          state={validationErrors['nomComplet'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['nomComplet']}
          nativeInputProps={{
            name: 'nomComplet',
            required: true,
            'aria-required': true,
          }}
        />
        <Input
          label="Fonction"
          state={validationErrors['fonction'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['fonction']}
          nativeInputProps={{
            name: 'fonction',
            required: true,
            'aria-required': true,
          }}
        />
      </>
    ))
    .with('dreal', () => (
      <Select
        label="Région"
        options={régions}
        state={validationErrors['region'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['region']}
        nativeSelectProps={{
          name: 'region',
          required: true,
          'aria-required': true,
        }}
      />
    ))
    .with('grd', () => (
      <Select
        label="Gestionnaire Réseau"
        options={gestionnairesRéseau}
        state={validationErrors['identifiantGestionnaireReseau'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['identifiantGestionnaireReseau']}
        nativeSelectProps={{
          name: 'identifiantGestionnaireReseau',
          required: true,
          'aria-required': true,
        }}
      />
    ))
    .with('cocontractant', () => (
      <Select
        label="Zone"
        options={zones}
        state={validationErrors['zone'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['zone']}
        nativeSelectProps={{
          name: 'zone',
          required: true,
          'aria-required': true,
        }}
      />
    ))
    .otherwise(() => <></>);
};
