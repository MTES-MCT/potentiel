'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';
import { createModal } from '@codegouvfr/react-dsfr/Modal';
import { v4 as uuid } from 'uuid';
import { useIsModalOpen } from '@codegouvfr/react-dsfr/Modal/useIsModalOpen';
import SelectNext from '@codegouvfr/react-dsfr/SelectNext';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';

import {
  transmettrePreuveRecandidatureAction,
  TransmettrePreuveRecandidatureFormKeys,
} from './transmettrePreuveRecandidature.action';

export type TransmettrePreuveRecandidatureFormProps = {
  identifiantProjet: string;
  projetsÀSélectionner: Array<ProjetÀSélectionner>;
};

type ProjetÀSélectionner = {
  identifiantProjet: string;
  appelOffre: string;
  période: string;
  famille: string;
  numéroCRE: string;
  nom: string;
};

// Form Modal à remplacer
export const TransmettrePreuveRecandidature = ({
  identifiantProjet,
  projetsÀSélectionner,
}: TransmettrePreuveRecandidatureFormProps) => {
  // trick to reset the form when re-opening the modal
  const id = uuid();
  const title = 'Transmettre la preuve de recandidature';

  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<TransmettrePreuveRecandidatureFormKeys>
  >({});

  const getProjectLabel = (projet: ProjetÀSélectionner) =>
    `${projet.nom} | ${projet.appelOffre}-P${projet.période}${
      projet.famille ? `-${projet.famille}` : ''
    }-${projet.numéroCRE}`;

  const [modal] = useState(
    createModal({
      id: `form-modal-${title}`,
      isOpenedByDefault: false,
    }),
  );

  const closeModal = () => {
    modal.close();
  };

  // close modal if inside "fermer" button is triggered
  useIsModalOpen(modal, {
    onConceal: () => closeModal(),
  });

  return (
    <>
      <Button priority="secondary" onClick={() => modal.open()} className="block w-1/2 text-center">
        Transmettre la preuve
      </Button>

      <modal.Component title={title}>
        <Form
          key={id}
          action={transmettrePreuveRecandidatureAction}
          onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
          actionButtons={{
            submitLabel: 'Transmettre',
            secondaryAction: {
              type: 'cancel',
              onClick: closeModal,
            },
          }}
        >
          <SelectNext
            label="Choisir un projet comme preuve de recandidature"
            placeholder={`Sélectionner un projet`}
            state={validationErrors['preuveRecandidature'] ? 'error' : 'default'}
            stateRelatedMessage="La sélection du projet est obligatoire"
            nativeSelectProps={{
              name: 'preuveRecandidature',
              required: true,
              'aria-required': true,
            }}
            options={projetsÀSélectionner.map((projet) => ({
              label: getProjectLabel(projet),
              value: projet.identifiantProjet,
            }))}
          />

          <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />
        </Form>
      </modal.Component>
    </>
  );
};
