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

import { getTypologieDuProjetLabel } from '../typologieDuProjetLabel';

import {
  modifierTypologieDuProjetAction,
  ModifierTypologieDuProjetFormKeys,
} from './modifierTypologieDuProjet.action';

export type ModifierTypologieDuProjetFormProps =
  PlainType<Lauréat.Installation.ConsulterTypologieDuProjetReadModel>;

export const ModifierTypologieDuProjetForm: FC<ModifierTypologieDuProjetFormProps> = ({
  identifiantProjet,
  typologieDuProjet: typologieDuProjetActuelle,
}) => {
  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierTypologieDuProjetFormKeys>
  >({});

  const [typologiesProjet, setTypologiesProjet] = useState<
    Array<Candidature.TypologieDuProjet.RawType>
  >(() =>
    typologieDuProjetActuelle.map((typologie) =>
      Candidature.TypologieDuProjet.bind(typologie).formatter(),
    ),
  );

  const typologiesExistantes = Candidature.TypologieDuProjet.typologies;

  const typologiesNonSélectionnées = typologiesExistantes.filter(
    (te) => !typologiesProjet.map((tp) => tp.typologie).includes(te),
  );

  const typologiesAvecDetails = [
    'bâtiment.serre',
    'ombrière.autre',
    'ombrière.mixte',
    'agrivoltaïque.serre',
  ];

  const [afficherDetails, setAfficherDetails] = useState<Record<number, boolean>>(
    Object.fromEntries(
      typologiesProjet.map((t, i) => [i, typologiesAvecDetails.includes(t.typologie)]),
    ),
  );

  const handleTypologieChange = (
    index: number,
    value: Candidature.TypologieDuProjet.ValueType['typologie'],
  ) => {
    setTypologiesProjet((prev) =>
      prev.map((t, i) => (i === index ? { ...t, typologie: value } : t)),
    );
    setAfficherDetails((prev) => ({
      ...prev,
      [index]: typologiesAvecDetails.includes(value),
    }));
  };

  const handleDetailsChange = (index: number, value: string) => {
    setTypologiesProjet((prev) => prev.map((t, i) => (i === index ? { ...t, détails: value } : t)));
  };

  const handleRemove = (index: number) => {
    setTypologiesProjet((prev) => prev.filter((_, i) => i !== index));
    setValidationErrors({});
  };

  const handleAdd = () => {
    setTypologiesProjet((prev) => [
      ...prev,
      { typologie: typologiesNonSélectionnées[0], détails: '' },
    ]);
  };

  return (
    <Form
      action={modifierTypologieDuProjetAction}
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
          const typologieFieldKey =
            `typologieDuProjet.${index}.typologie` satisfies ModifierTypologieDuProjetFormKeys;
          const detailsFieldKey =
            `typologieDuProjet.${index}.details` satisfies ModifierTypologieDuProjetFormKeys;

          return (
            <div className="flex flex-row gap-2" key={`${typologie}-${index}`}>
              <Select
                state={validationErrors[typologieFieldKey] ? 'error' : 'default'}
                stateRelatedMessage={validationErrors[typologieFieldKey]}
                options={[
                  ...typologiesNonSélectionnées.map((t) => ({
                    label: getTypologieDuProjetLabel(t),
                    value: t,
                  })),
                  {
                    label: getTypologieDuProjetLabel(typologie),
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
              {afficherDetails[index] && (
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
    </Form>
  );
};
