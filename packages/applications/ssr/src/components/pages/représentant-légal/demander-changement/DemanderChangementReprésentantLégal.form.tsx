'use client';

import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';
import SelectNext from '@codegouvfr/react-dsfr/SelectNext';

import { Form } from '@/components/atoms/form/Form';
import { SubmitButton } from '@/components/atoms/form/SubmitButton';
import { UploadDocument } from '@/components/atoms/form/UploadDocument';
import { ValidationErrors } from '@/utils/formAction';

import {
  demanderChangementReprésentantLégalAction,
  DemanderChangementReprésentantLégalFormKeys,
} from './demanderChangementReprésentantLégal.action';

export type DemanderChangementReprésentantLégalFormProps = {
  identifiantProjet: string;
};

export const DemanderChangementReprésentantLégalForm: FC<
  DemanderChangementReprésentantLégalFormProps
> = ({ identifiantProjet }) => {
  type TypeDePersonne = 'Personne physique' | 'Personne morale' | 'Collectivité' | 'Autre';

  const [typeDePersonne, selectTypeDePersonne] = useState<TypeDePersonne>();

  const getNomReprésentantLégalHintText = () => {
    switch (typeDePersonne) {
      case 'Personne physique':
        return 'les nom et prénom';
      case 'Personne morale':
        return 'le nom de la société';
      case 'Collectivité':
        return 'le nom de la collectivité';
      case 'Autre':
        return `le nom de l'organisme`;
      default:
        return 'le nom';
    }
  };
  const getPièceJustificativeHintText = () => {
    switch (typeDePersonne) {
      case 'Personne physique':
        return `Une copie de titre d'identité (carte d'identité ou passeport) en cours de validité`;
      case 'Personne morale':
        return 'Un extrait Kbis, pour les sociétés en cours de constitutionv une copie des statuts de la société en cours de constitution, une attestation de récépissé de dépôt de fonds pour constitution de capital social et une copie de l’acte désignant le représentant légal de la société';
      case 'Collectivité':
        return `Un extrait de délibération portant sur le projet objet de l'offre`;
      default:
        return `Tout document officiel permettant d'attester de l'existence juridique de la personne`;
    }
  };

  const [validationErrors, setValidationErrors] = useState<
    ValidationErrors<DemanderChangementReprésentantLégalFormKeys>
  >({});

  return (
    <Form
      action={demanderChangementReprésentantLégalAction}
      method="POST"
      encType="multipart/form-data"
      onValidationError={(validationErrors) => setValidationErrors(validationErrors)}
      actions={<SubmitButton>Demander</SubmitButton>}
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
        }}
        state={validationErrors['nomRepresentantLegal'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['nomRepresentantLegal']}
      />

      <UploadDocument
        label={'Pièce justificative'}
        id="pieceJustificative"
        name="pieceJustificative"
        hintText={getPièceJustificativeHintText()}
        required
        state={validationErrors['pieceJustificative'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['pieceJustificative']}
      />
    </Form>
  );
};
