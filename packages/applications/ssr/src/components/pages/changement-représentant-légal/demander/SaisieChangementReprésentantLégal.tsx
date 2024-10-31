'use client';
import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';
import SelectNext from '@codegouvfr/react-dsfr/SelectNext';
import { match } from 'ts-pattern';

import { ValidationErrors } from '@/utils/formAction';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';

import { DemanderChangementReprésentantLégalFormKeys } from './demanderChangementReprésentantLégal.action';

export type SaisieChangementReprésentantLégal = {
  typePersonne: string | undefined;
  nomReprésentantLégal: string;
  piècesJustificatives: ReadonlyArray<string>;
};

export type SaisieChangementReprésentantLégalProps = {
  onChange?: (changes: SaisieChangementReprésentantLégal) => void;
  validationErrors: ValidationErrors<DemanderChangementReprésentantLégalFormKeys>;
};

type TypeDePersonne = 'Personne physique' | 'Personne morale' | 'Collectivité' | 'Autre';

export const SaisieChangementReprésentantLégal: FC<SaisieChangementReprésentantLégalProps> = ({
  validationErrors,
  onChange,
}) => {
  const [typePersonne, selectTypePersonne] = useState<TypeDePersonne>();
  const [nomReprésentantLégal, setNomReprésentantLégal] = useState('');
  const [piècesJustificatives, setPiècesJustificatives] = useState<ReadonlyArray<string>>([]);

  const getNomReprésentantLégalHintText = () =>
    match(typePersonne)
      .with('Personne physique', () => 'les nom et prénom')
      .with('Personne morale', () => 'le nom de la société')
      .with('Collectivité', () => 'le nom de la collectivité')
      .with('Autre', () => `le nom de l'organisme`)
      .otherwise(() => 'le nom');

  const getPièceJustificativeHintText = () =>
    match(typePersonne)
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

  return (
    <>
      <SelectNext
        label="Choisir le type de personne pour le représentant légal"
        placeholder={`Sélectionner le type de personne pour le représentant légal`}
        state={validationErrors['typeDePersonne'] ? 'error' : 'default'}
        stateRelatedMessage="Le type de personne pour le représentant légal est obligatoire"
        nativeSelectProps={{
          onChange: ({ currentTarget: { value } }) => {
            selectTypePersonne(value as TypeDePersonne);
            onChange &&
              onChange({ typePersonne: value, nomReprésentantLégal, piècesJustificatives });
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
          onChange: (e) => {
            setNomReprésentantLégal(e.target.value);
            onChange &&
              onChange({
                typePersonne,
                nomReprésentantLégal: e.target.value,
                piècesJustificatives,
              });
          },
        }}
        state={validationErrors['nomRepresentantLegal'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['nomRepresentantLegal']}
      />

      <UploadNewOrModifyExistingDocument
        label={'Pièce justificative'}
        name="pieceJustificative"
        hintText={getPièceJustificativeHintText()}
        required
        formats={['pdf']}
        multiple
        state={validationErrors['pieceJustificative'] ? 'error' : 'default'}
        stateRelatedMessage={validationErrors['pieceJustificative']}
        onChange={(fileNames) => {
          setPiècesJustificatives(fileNames);
          onChange &&
            onChange({
              typePersonne,
              nomReprésentantLégal,
              piècesJustificatives: fileNames,
            });
        }}
      />
    </>
  );
};
