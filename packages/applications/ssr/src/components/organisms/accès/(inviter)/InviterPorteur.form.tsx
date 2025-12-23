'use client';

import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';
import Button from '@codegouvfr/react-dsfr/Button';
import Checkbox from '@codegouvfr/react-dsfr/Checkbox';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { ValidationErrors } from '@/utils/formAction';
import { ModalWithForm } from '@/components/molecules/ModalWithForm';

import { inviterPorteurAction, InviterPorteurFormKeys } from './inviterPorteur.action';

export type InviterPorteurFormProps = {
  identifiantProjet: IdentifiantProjet.RawType;
  nombreDeProjets?: number;
  peutInviter: boolean;
};

export const InviterPorteurForm: FC<InviterPorteurFormProps> = ({
  identifiantProjet,
  nombreDeProjets,
  peutInviter,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<InviterPorteurFormKeys>
  >({});

  return (
    <>
      {peutInviter && (
        <Button iconId="fr-icon-user-line" onClick={() => setIsOpen(true)}>
          Inviter un nouvel utilisateur
        </Button>
      )}
      <ModalWithForm
        id="inviter-porteur-form"
        title=""
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          omitMandatoryFieldsLegend: true,
          heading: 'Inviter un porteur de projet',
          submitLabel: 'Inviter',
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
                  {nombreDeProjets && nombreDeProjets > 1 && (
                    <Checkbox
                      id="inviterATousSesProjets"
                      state={validationErrors['inviterATousSesProjets'] ? 'error' : 'default'}
                      stateRelatedMessage={validationErrors['inviterATousSesProjets']}
                      options={[
                        {
                          label: `Je souhaite inviter l'utilisateur à tous mes projets (${nombreDeProjets} projets)`,
                          nativeInputProps: {
                            name: 'inviterATousSesProjets',
                            value: 'true',
                          },
                        },
                      ]}
                    />
                  )}
                </div>
              </div>
            </>
          ),
        }}
      />
    </>
  );
};
