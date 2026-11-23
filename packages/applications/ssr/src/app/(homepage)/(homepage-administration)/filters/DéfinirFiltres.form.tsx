'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import Input from '@codegouvfr/react-dsfr/Input';
import Tooltip from '@codegouvfr/react-dsfr/Tooltip';
import { type FC, useState } from 'react';

import type { IdentifiantProjet } from '@potentiel-domain/projet';

import { ModalWithForm } from '@/components/molecules/ModalWithForm';
import type { ValidationErrors } from '@/utils/formAction';
import { type DéfinirFiltresFormKeys, définirFiltresAction } from './définirFiltres';

export type DéfinirFiltresFormProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const DéfinirFiltresForm: FC<DéfinirFiltresFormProps> = ({ identifiantProjet }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<DéfinirFiltresFormKeys>
  >({});

  // Département
  // technologie
  // Afficher les filtres comme sur les demandes
  return (
    <>
      <Tooltip title="Définir mes filtres">
        <Button iconId="ri-equalizer-3-fill" onClick={() => setIsOpen(true)}>
          ""
        </Button>
      </Tooltip>

      <ModalWithForm
        id="définir-filtres-form"
        title=""
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        form={{
          omitMandatoryFieldsLegend: true,
          heading: 'Définir mes filtres',
          submitLabel: 'Confirmer',
          action: définirFiltresAction,
          onValidationError: (validationErrors) => setValidationErrors(validationErrors),
          children: (
            <>
              <input name="identifiantProjet" type="hidden" value={identifiantProjet} />

              <div className="flex flex-col gap-5">
                <div>
                  <Input
                    nativeInputProps={{
                      name: 'identifiantUtilisateurInvité',
                      required: true,
                      type: 'email',
                      'aria-required': true,
                    }}
                    label="Courrier électronique de la personne habilitée à suivre ce projet"
                    state={validationErrors['identifiantUtilisateurInvité'] ? 'error' : 'default'}
                    stateRelatedMessage={validationErrors['identifiantUtilisateurInvité']}
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
