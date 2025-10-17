'use client';

import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import { match } from 'ts-pattern';

import { Role } from '@potentiel-domain/utilisateur';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';
import { listeDesRolesSaufPorteur } from '@/utils/utilisateur/format-role';

import { inviterUtilisateurAction, InviterUtilisateurFormKeys } from './inviterUtilisateur.action';

export type InviterUtilisateurFormProps = {
  role?: Role.RawType;
  régions: { label: string; value: string }[];
  gestionnairesRéseau: { label: string; value: string }[];
  zones: { label: string; value: string }[];
};

export const InviterUtilisateurForm: FC<InviterUtilisateurFormProps> = ({
  role: roleProp,
  gestionnairesRéseau,
  régions,
  zones,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<InviterUtilisateurFormKeys>
  >({});
  const [role, setRole] = useState(roleProp);

  return (
    <Form
      action={inviterUtilisateurAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      heading="Inviter un utilisateur"
      actionButtons={{
        submitLabel: 'Inviter',
      }}
    >
      <div className="flex flex-col gap-5">
        <div>
          <Select
            label="Role"
            options={listeDesRolesSaufPorteur}
            nativeSelectProps={{
              name: 'role',
              value: role,
              onChange: (e) => setRole(e.target.value),
              required: true,
              'aria-required': true,
            }}
          />

          <Input
            nativeInputProps={{
              name: 'identifiantUtilisateurInvite',
              type: 'email',
              required: true,
              'aria-required': true,
            }}
            label="Courrier électronique de la personne"
            state={validationErrors['identifiantUtilisateurInvite'] ? 'error' : 'default'}
            stateRelatedMessage={validationErrors['identifiantUtilisateurInvite']}
          />

          {match(role)
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
            .otherwise(() => (
              <></>
            ))}
        </div>
      </div>
    </Form>
  );
};
