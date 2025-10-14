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
    ValidationErrors<ModifierTypologieInstallationFormKeys>
  >({});

  const listeTypologiesDisponibles = Candidature.TypologieInstallation.typologies;

  const typologiesAvecDetailsSousInstallation = [
    'bâtiment.serre',
    'ombrière.autre',
    'ombrière.mixte',
    'agrivoltaïque.serre',
  ];

  const [typologies, setTypologies] = useState<Array<Candidature.TypologieInstallation.RawType>>(
    () =>
      typologieInstallationActuelle.map((typologie) =>
        Candidature.TypologieInstallation.bind(typologie).formatter(),
      ),
  );

  const handleTypologieChange = (
    index: number,
    value: Candidature.TypologieInstallation.RawType['typologie'],
  ) => {
    setTypologies((prev) =>
      prev.map((t, i) => (i === index ? { ...t, typologie: value, détails: '' } : t)),
    );
  };

  const handleDetailsChange = (index: number, value: string) => {
    setTypologies((prev) => prev.map((t, i) => (i === index ? { ...t, détails: value } : t)));
  };

  const addSecondTypologie = () => {
    if (typologies.length < 2) {
      setTypologies((prev) => [...prev, { typologie: listeTypologiesDisponibles[0], détails: '' }]);
    }
  };

  const removeSecondTypologie = () => {
    if (typologies.length === 2) {
      setTypologies((prev) => prev.slice(0, 1));
    }
  };

  return (
    <Form
      action={modifierTypologieInstallationAction}
      onValidationError={setValidationErrors}
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

      <div className="flex flex-row gap-2">
        <Select
          label="Typologie 1"
          state={validationErrors['typologieInstallation.0.typologie'] ? 'error' : 'default'}
          stateRelatedMessage={validationErrors['typologieInstallation.0.typologie']}
          options={listeTypologiesDisponibles.map((typologie) => ({
            label: getTypologieInstallationLabel(typologie),
            value: typologie,
          }))}
          className="flex-1"
          nativeSelectProps={{
            name: 'typologieInstallation.0.typologie',
            value: typologies[0]?.typologie ?? listeTypologiesDisponibles[0],
            required: true,
            onChange: (e) =>
              handleTypologieChange(
                0,
                e.target.value as Candidature.TypologieInstallation.RawType['typologie'],
              ),
          }}
        />
        {typologiesAvecDetailsSousInstallation.includes(typologies[0].typologie) && (
          <Input
            label="Détails typologie 1"
            state={validationErrors['typologieInstallation.0.details'] ? 'error' : 'default'}
            stateRelatedMessage={validationErrors['typologieInstallation.0.details']}
            className="flex-1"
            nativeInputProps={{
              name: 'typologieInstallation.0.details',
              value: typologies[0]?.détails ?? '',
              required: true,
              placeholder: "Précisez les éléments sous l'installation",
              onChange: (e) => handleDetailsChange(0, e.target.value),
            }}
          />
        )}
      </div>

      {typologies[1] && (
        <div className="flex flex-row gap-2 items-center">
          <Select
            label="Typologie 2"
            state={validationErrors['typologieInstallation.1.typologie'] ? 'error' : 'default'}
            stateRelatedMessage={validationErrors['typologieInstallation.1.typologie']}
            options={listeTypologiesDisponibles
              .filter((typologie) => typologie !== typologies[0].typologie)
              .map((typologie) => ({
                label: getTypologieInstallationLabel(typologie),
                value: typologie,
              }))}
            className="flex-1"
            nativeSelectProps={{
              name: 'typologieInstallation.1.typologie',
              value: typologies[1].typologie,
              required: true,
              onChange: (e) =>
                handleTypologieChange(
                  1,
                  e.target.value as Candidature.TypologieInstallation.RawType['typologie'],
                ),
            }}
          />
          {typologiesAvecDetailsSousInstallation.includes(typologies[1].typologie) && (
            <Input
              label="Détails typologie 2"
              state={validationErrors['typologieInstallation.1.details'] ? 'error' : 'default'}
              stateRelatedMessage={validationErrors['typologieInstallation.1.details']}
              className="flex-1"
              nativeInputProps={{
                name: 'typologieInstallation.1.details',
                value: typologies[1]?.détails ?? '',
                required: true,
                placeholder: "Précisez les éléments sous l'installation",
                onChange: (e) => handleDetailsChange(1, e.target.value),
              }}
            />
          )}
          <Button
            className=""
            type="button"
            size="small"
            priority="tertiary no outline"
            iconId="fr-icon-delete-bin-line"
            title="Supprimer la seconde typologie"
            onClick={removeSecondTypologie}
          />
        </div>
      )}

      {!typologies[1] && (
        <Button
          iconId="fr-icon-add-circle-line"
          title="Ajouter une seconde typologie"
          size="small"
          type="button"
          onClick={addSecondTypologie}
        >
          Ajouter une seconde typologie
        </Button>
      )}
    </Form>
  );
};
