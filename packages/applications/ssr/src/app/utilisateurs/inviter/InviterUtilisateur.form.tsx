'use client';

import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';
import Select from '@codegouvfr/react-dsfr/SelectNext';

import { Role } from '@potentiel-domain/utilisateur';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';
import { listeDesRolesSaufPorteur } from '@/utils/utilisateur/format-role';

import { SpécificitésRoleInput } from '../_components/SpécifitéRoleInput';

import { inviterUtilisateurAction, InviterUtilisateurFormKeys } from './inviterUtilisateur.action';

export type InviterUtilisateurFormProps = {
  rôle?: Role.RawType;
  régions: { label: string; value: string }[];
  gestionnairesRéseau: { label: string; value: string }[];
  zones: { label: string; value: string }[];
};

export const InviterUtilisateurForm: FC<InviterUtilisateurFormProps> = ({
  rôle: rôleProp,
  gestionnairesRéseau,
  régions,
  zones,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<InviterUtilisateurFormKeys>
  >({});
  const [rôle, setRôle] = useState(rôleProp);

  return (
    <Form
      action={inviterUtilisateurAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
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
              value: rôle,
              onChange: (e) => setRôle(e.target.value),
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

          {rôle && (
            <SpécificitésRoleInput
              rôle={rôle}
              gestionnairesRéseau={gestionnairesRéseau}
              régions={régions}
              zones={zones}
              validationErrors={validationErrors}
            />
          )}
        </div>
      </div>
    </Form>
  );
};
