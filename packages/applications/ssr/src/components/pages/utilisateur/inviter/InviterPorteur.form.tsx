'use client';

import { FC, useState } from 'react';
import Button from '@codegouvfr/react-dsfr/Button';
import Input from '@codegouvfr/react-dsfr/Input';

import { Routes } from '@potentiel-applications/routes';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { PlainType } from '@potentiel-domain/core';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { ValidationErrors } from '@/utils/formAction';

import { inviterPorteurAction, InviterPorteurFormKeys } from './inviterPorteur.action';

export type InviterPorteurFormProps = {
  identifiantProjet: PlainType<IdentifiantProjet.ValueType>;
};

export const InviterPorteurForm: FC<InviterPorteurFormProps> = ({ identifiantProjet }) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<InviterPorteurFormKeys>
  >({});

  return (
    <Form
      action={inviterPorteurAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      heading="Inviter un utilisateur"
      actions={
        <>
          <Button
            priority="secondary"
            linkProps={{
              href: Routes.Projet.details(IdentifiantProjet.bind(identifiantProjet).formatter()),
              prefetch: false,
            }}
            iconId="fr-icon-arrow-left-line"
          >
            Retour au projet
          </Button>
          <SubmitButton>Inviter</SubmitButton>
        </>
      }
    >
      <input
        name="identifiantProjet"
        type="hidden"
        value={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />

      <div className="flex flex-col gap-5">
        <div>
          <Input
            nativeInputProps={{
              name: 'identifiantUtilisateurInvite',
              required: true,
              type: 'email',
              'aria-required': true,
            }}
            label="Courrier électronique de la personne habilitée à suivre ce projet"
            state={validationErrors['identifiantUtilisateurInvite'] ? 'error' : 'default'}
            stateRelatedMessage={validationErrors['identifiantUtilisateurInvite']}
          />
        </div>
      </div>
    </Form>
  );
};
