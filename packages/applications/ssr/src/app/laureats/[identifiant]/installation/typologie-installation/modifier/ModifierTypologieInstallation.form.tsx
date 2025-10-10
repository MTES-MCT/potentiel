'use client';

import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';
import Select from '@codegouvfr/react-dsfr/SelectNext';
import Button from '@codegouvfr/react-dsfr/Button';

import { Routes } from '@potentiel-applications/routes';
import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { Form } from '@/components/atoms/form/Form';
import { ValidationErrors } from '@/utils/formAction';

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
    ValidationErrors<ModifierTypologieInstallationFormKeys> & Record<string, string | undefined>
  >({});

  const [typologiesProjet, setTypologiesProjet] = useState<
    Array<Candidature.TypologieInstallation.RawType>
  >(() =>
    typologieInstallationActuelle.map((typologie) =>
      Candidature.TypologieInstallation.bind(typologie).formatter(),
    ),
  );

  const listeTypologiesDisponibles = Candidature.TypologieInstallation.typologies;
  return (
    <Form
      action={modifierTypologieInstallationAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actionButtons={{
        submitLabel: 'Modifier',
        secondaryAction: {
          type: 'back',
          href: Routes.Projet.details(IdentifiantProjet.bind(identifiantProjet).formatter()),
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
          const typologieFieldKey = `typologieInstallation.${index}.typologie`;
          const detailsFieldKey = `typologieInstallation.${index}.details`;
          return (
            <div className="flex flex-row  gap-2" key={`${typologie}-${détails}`}>
              <Select
                state={validationErrors[typologieFieldKey] ? 'error' : 'default'}
                stateRelatedMessage={validationErrors[typologieFieldKey]}
                options={listeTypologiesDisponibles.map((typologie) => ({
                  label: getTypologieInstallationLabel(typologie),
                  value: typologie,
                }))}
                label=""
                className="flex-1"
                nativeSelectProps={{
                  name: typologieFieldKey,
                  defaultValue: typologie,
                  required: true,
                }}
              />
              <Input
                label=""
                state={validationErrors[detailsFieldKey] ? 'error' : 'default'}
                stateRelatedMessage={validationErrors[detailsFieldKey]}
                className="flex-1"
                nativeInputProps={{
                  placeholder: 'Détails',
                  defaultValue: détails,
                  name: detailsFieldKey,
                }}
              />
              <Button
                className="mt-1"
                type="button"
                size="small"
                priority="tertiary no outline"
                iconId="fr-icon-delete-bin-line"
                title="Supprimer la typologie"
                onClick={() => {
                  setTypologiesProjet((typologies) => typologies.filter((_, i) => index !== i));
                  setValidationErrors({});
                }}
              />
            </div>
          );
        })}
        <Button
          iconId="fr-icon-add-circle-line"
          title="Ajouter une typologie"
          size="small"
          type="button"
          onClick={() => {
            setTypologiesProjet((typologies) =>
              typologies.concat({
                typologie: listeTypologiesDisponibles[0],
                détails: '',
              }),
            );
            return false;
          }}
        >
          Ajouter
        </Button>
      </div>
    </Form>
  );
};
