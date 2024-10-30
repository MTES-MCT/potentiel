'use client';

import { FC, useState } from 'react';
import { match } from 'ts-pattern';
import Input from '@codegouvfr/react-dsfr/Input';
import SelectNext from '@codegouvfr/react-dsfr/SelectNext';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';
import { ValidationErrors } from '@/utils/formAction';

import {
  modifierChangementReprésentantLégalAction,
  ModifierChangementReprésentantLégalFormKeys,
} from './modifierChangementReprésentantLégal.action';

type TypeDePersonne = 'Personne physique' | 'Personne morale' | 'Collectivité' | 'Autre';

export type ModifierChangementReprésentantLégalFormProps = {
  identifiantProjet: string;
  typePersonne: TypeDePersonne;
  nomRepresentantLegal: string;
  pièceJustificative: string;
};

export const ModifierChangementReprésentantLégalForm: FC<
  ModifierChangementReprésentantLégalFormProps
> = ({ identifiantProjet, typePersonne, nomRepresentantLegal, pièceJustificative }) => {
  const [typeDePersonne, selectTypeDePersonne] = useState<TypeDePersonne>();

  const getNomReprésentantLégalHintText = () =>
    match(typeDePersonne)
      .with('Personne physique', () => 'les nom et prénom')
      .with('Personne morale', () => 'le nom de la société')
      .with('Collectivité', () => 'le nom de la collectivité')
      .with('Autre', () => `le nom de l'organisme`)
      .otherwise(() => 'le nom');

  const getPièceJustificativeHintText = () =>
    match(typeDePersonne)
      .with(
        'Personne physique',
        () => `Une copie de titre d'identité (carte d'identité ou passeport) en cours de validité`,
      )
      .with(
        'Personne morale',
        () =>
          'Un extrait Kbis, pour les sociétés en cours de constitutionv une copie des statuts de la société en cours de constitution, une attestation de récépissé de dépôt de fonds pour constitution de capital social et une copie de l’acte désignant le représentant légal de la société',
      )
      .with(
        'Collectivité',
        () => `Un extrait de délibération portant sur le projet objet de l'offre`,
      )
      .otherwise(
        () =>
          `Tout document officiel permettant d'attester de l'existence juridique de la personne`,
      );

  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<ModifierChangementReprésentantLégalFormKeys>
  >({});

  return (
    <Form
      action={modifierChangementReprésentantLégalAction}
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actions={<SubmitButton>Modifier</SubmitButton>}
    >
      <input type={'hidden'} value={identifiantProjet} name="identifiantProjet" />

      <SelectNext
        label="Choisir le type de personne pour le représentant légal"
        placeholder={`Sélectionner le type de personne pour le représentant légal`}
        state={validationErrors['typeDePersonne'] ? 'error' : 'default'}
        stateRelatedMessage="Le type de personne pour le représentant légal est obligatoire"
        nativeSelectProps={{
          onChange: ({ currentTarget: { value } }) => {
            selectTypeDePersonne(value as TypeDePersonne);
          },
          defaultValue: typePersonne,
        }}
        options={['Personne physique', 'Personne morale', 'Collectivité', 'Autre'].map((type) => ({
          label: type,
          value: type,
        }))}
      />

      <Input
        label="Nom du représentant légal"
        id="nomRepresentantLegal"
        hintText={`Veuillez préciser ${getNomReprésentantLégalHintText()} pour le nouveau représentant légal de votre projet`}
        nativeInputProps={{
          name: 'nomRepresentantLegal',
          required: true,
          'aria-required': true,
          defaultValue: nomRepresentantLegal,
        }}
        state={validationErrors['nomRepresentantLegal'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['nomRepresentantLegal']}
      />

      <UploadNewOrModifyExistingDocument
        label={'Pièce justificative'}
        id="pieceJustificative"
        name="pieceJustificative"
        formats={['pdf']}
        hintText={getPièceJustificativeHintText()}
        required
        state={validationErrors['pieceJustificative'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['pieceJustificative']}
        documentKeys={[pièceJustificative]}
      />
    </Form>
  );
};
