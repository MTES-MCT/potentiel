'use client';

import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';
import Button from '@codegouvfr/react-dsfr/Button';

import { IdentifiantProjet } from '@potentiel-domain/common';

import { ValidationErrors } from '@/utils/formAction';
import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { inviterPorteurAction, InviterPorteurFormKeys } from './inviterPorteur.action';

export type InviterPorteurFormProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const InviterPorteurForm: FC<InviterPorteurFormProps> = ({ identifiantProjet }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<InviterPorteurFormKeys>
  >({});

  return (
    <>
      <Button iconId="fr-icon-user-line" onClick={() => setIsOpen(true)}>
        Inviter un nouvel utilisateur sur le projet
      </Button>
      <ModalWithForm
        id="inviter-porteur-form"
        title=""
        acceptButtonLabel="Inviter"
        rejectButtonLabel="Annuler"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          omitMandatoryFieldsLegend: true,
          heading: 'Inviter un porteur de projet',
          action: inviterPorteurAction,
          onValidationError: (validationErrors) => setValidationErrors(validationErrors),
          children: (
            <>
              <input name="identifiantProjet" type="hidden" value={identifiantProjet} />

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
            </>
          ),
        }}
      />
    </>
  );
};
