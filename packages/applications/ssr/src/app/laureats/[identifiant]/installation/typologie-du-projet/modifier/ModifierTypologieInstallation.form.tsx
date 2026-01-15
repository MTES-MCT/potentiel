'use client';

import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import Button from '@codegouvfr/react-dsfr/Button';

import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';

import { getTypologieInstallationLabel } from '../typologieInstallationLabel';

import {
  modifierTypologieInstallationAction,
  ModifierTypologieInstallationFormKeys,
} from './modifierTypologieInstallation.action';

export type ModifierTypologieInstallationFormProps =
  PlainType<Lauréat.Installation.ConsulterTypologieInstallationReadModel>;

export const ModifierTypologieInstallationForm: FC<ModifierTypologieInstallationFormProps> = ({
  identifiantProjet,
  typologieInstallation: typologieInstallationActuelle,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierTypologieInstallationFormKeys>
  >({});

  const [typologiesProjet, setTypologiesProjet] = useState<
    Array<Candidature.TypologieInstallation.RawType>
  >(() =>
    typologieInstallationActuelle.map((typologie) =>
      Candidature.TypologieInstallation.bind(typologie).formatter(),
    ),
  );

  const typologiesExistantes = Candidature.TypologieInstallation.typologies;

  const typologiesNonSélectionnées = typologiesExistantes.filter(
    (te) => !typologiesProjet.map((tp) => tp.typologie).includes(te),
  );

  const typologiesAvecDetails = [
    'bâtiment.serre',
    'ombrière.autre',
    'ombrière.mixte',
    'agrivoltaïque.serre',
  ];

  const handleTypologieChange = (
    index: number,
    value: Candidature.TypologieInstallation.ValueType['typologie'],
  ) => {
    setTypologiesProjet((prev) =>
      prev.map((t, i) => (i === index ? { ...t, typologie: value } : t)),
    );
  };

  const handleDetailsChange = (index: number, value: string) => {
    setTypologiesProjet((prev) => prev.map((t, i) => (i === index ? { ...t, détails: value } : t)));
  };

  const handleRemove = (index: number) => {
    setTypologiesProjet((prevTypos) => {
      const newTypologies = prevTypos.filter((_, i) => i !== index);

      return newTypologies;
    });
    setValidationErrors({});
  };

  const handleAdd = () => {
    setTypologiesProjet((prev) => {
      const nouvelleTypologie = {
        typologie: typologiesNonSélectionnées[0],
        détails: '',
      };
      const newTypologies = [...prev, nouvelleTypologie];

      return newTypologies;
    });
  };

  return (
    <Form
      action={modifierTypologieInstallationAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Modifier',
        secondaryAction: {
          type: 'back',
        },
      }}
    >
      <input
        name="identifiantProjet"
        type="hidden"
        value={IdentifiantProjet.bind(identifiantProjet).formatter()}
      />

      <div className="flex flex-col gap-2">
        {typologiesProjet.map(({ typologie, détails }, index) => {
          const typologieFieldKey =
            `typologieInstallation.${index}.typologie` satisfies ModifierTypologieInstallationFormKeys;
          const detailsFieldKey =
            `typologieInstallation.${index}.details` satisfies ModifierTypologieInstallationFormKeys;

          return (
            <div className="flex flex-row gap-2" key={`${typologie}-${index}`}>
              <Select
                state={validationErrors[typologieFieldKey] ? 'error' : 'default'}
                stateRelatedMessage={validationErrors[typologieFieldKey]}
                options={[
                  ...typologiesNonSélectionnées.map((t) => ({
                    label: getTypologieInstallationLabel(t),
                    value: t,
                  })),
                  {
                    label: getTypologieInstallationLabel(typologie),
                    value: typologie,
                  },
                ]}
                label=""
                className="flex-1"
                nativeSelectProps={{
                  name: typologieFieldKey,
                  value: typologie,
                  required: true,
                  onChange: (e) => handleTypologieChange(index, e.target.value),
                }}
              />
              {typologiesAvecDetails.includes(typologie) && (
                <Input
                  label=""
                  state={validationErrors[detailsFieldKey] ? 'error' : 'default'}
                  stateRelatedMessage={validationErrors[detailsFieldKey]}
                  className="flex-1"
                  nativeInputProps={{
                    placeholder: "Précisez les éléments sous l'installation",
                    value: détails,
                    name: detailsFieldKey,
                    required: true,
                    onChange: (e) => handleDetailsChange(index, e.target.value),
                  }}
                />
              )}
              <Button
                className="mt-1"
                type="button"
                size="small"
                priority="tertiary no outline"
                iconId="fr-icon-delete-bin-line"
                title="Supprimer la typologie"
                onClick={() => handleRemove(index)}
              />
            </div>
          );
        })}

        <Button
          iconId="fr-icon-add-circle-line"
          title="Ajouter une typologie"
          size="small"
          type="button"
          onClick={handleAdd}
        >
          Ajouter
        </Button>
      </div>
      <Input
        textArea
        label="Raison"
        id="raison"
        hintText="Veuillez détailler les raisons de ce changement"
        nativeTextAreaProps={{ name: 'raison', required: true, 'aria-required': true }}
        state={validationErrors['raison'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['raison']}
      />

      <UploadNewOrModifyExistingDocument
        label="Pièce justificative (optionnel)"
        name="piecesJustificatives"
        hintText="Si pertinent, veuillez joindre vos justificatifs"
        multiple
        formats={['pdf']}
        state={validationErrors['piecesJustificatives'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['piecesJustificatives']}
      />
    </Form>
  );
};
