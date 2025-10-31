'use client';

import { FC, useState } from 'react';
import Select from '@codegouvfr/react-dsfr/SelectNext';

import { Role, ConsulterUtilisateurReadModel } from '@potentiel-domain/utilisateur';
import { PlainType } from '@potentiel-domain/core';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';
import { listeDesRolesSaufPorteur } from '@/utils/utilisateur/format-role';

import { SpécificitésRoleInput } from '../../_components/SpécifitéRoleInput';

import {
  modifierRôleUtilisateurAction,
  ModifierRôleUtilisateurFormKeys,
} from './modifierRôleUtilisateur.action';

export type ModifierRôleUtilisateurFormProps = {
  utilisateur: PlainType<ConsulterUtilisateurReadModel>;
  régions: { label: string; value: string }[];
  gestionnairesRéseau: { label: string; value: string }[];
  zones: { label: string; value: string }[];
};

export const ModifierRôleUtilisateurForm: FC<ModifierRôleUtilisateurFormProps> = ({
  utilisateur,
  gestionnairesRéseau,
  régions,
  zones,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierRôleUtilisateurFormKeys>
  >({});
  const [rôle, setRole] = useState<Role.RawType | undefined>(undefined);

  return (
    <Form
      action={modifierRôleUtilisateurAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      heading={`Modifier le rôle de ${utilisateur.identifiantUtilisateur.email}`}
      actionButtons={{
        submitLabel: 'Modifier le rôle',
      }}
    >
      <div className="flex flex-col gap-5">
        <input
          type="hidden"
          name="identifiantUtilisateur"
          value={utilisateur.identifiantUtilisateur.email}
        />
        <div>
          <p className="mb-2">
            <strong>Rôle actuel :</strong> {utilisateur.rôle.nom}
          </p>
        </div>

        <div>
          <Select
            label="Nouveau rôle"
            options={listeDesRolesSaufPorteur}
            nativeSelectProps={{
              name: 'nouveauRole',
              value: rôle,
              onChange: (event) => setRole(event.target.value as Role.RawType),
              required: true,
            }}
            state={validationErrors?.nouveauRole ? 'error' : 'default'}
            stateRelatedMessage={validationErrors?.nouveauRole}
          />
        </div>
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
    </Form>
  );
};
