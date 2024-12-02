'use client';
import { FC, useState } from 'react';
import Input from '@codegouvfr/react-dsfr/Input';
import { match } from 'ts-pattern';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { ValidationErrors } from '@/utils/formAction';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';

import { DemanderChangementReprésentantLégalFormKeys } from '../demanderChangementReprésentantLégal.action';
import { TypeReprésentantLégalSelect } from '../../../TypeReprésentantLégalSelect';

export type SaisieChangementReprésentantLégal = {
  typePersonne: string | undefined;
  nomReprésentantLégal: string;
  piècesJustificatives: ReadonlyArray<string>;
};

export type SaisieChangementReprésentantLégalProps = {
  onChange?: (changes: SaisieChangementReprésentantLégal) => void;
  validationErrors: ValidationErrors<DemanderChangementReprésentantLégalFormKeys>;
};

export const SaisieChangementReprésentantLégal: FC<SaisieChangementReprésentantLégalProps> = ({
  validationErrors,
  onChange,
}) => {
  const [typePersonne, selectTypePersonne] =
    useState<ReprésentantLégal.TypeReprésentantLégal.RawType>('inconnu');
  const [nomReprésentantLégal, setNomReprésentantLégal] = useState('');
  const [piècesJustificatives, setPiècesJustificatives] = useState<ReadonlyArray<string>>([]);

  const getNomReprésentantLégalHintText = () =>
    match(typePersonne)
      .with('personne-physique', () => 'les nom et prénom')
      .with('personne-morale', () => 'le nom de la société')
      .with('collectivité', () => 'le nom de la collectivité')
      .with('autre', () => `le nom de l'organisme`)
      .with('inconnu', () => 'le nom')
      .exhaustive();

  const getPièceJustificativeHintText = () =>
    match(typePersonne)
      .with(
        'personne-physique',
        () => `Une copie de titre d'identité (carte d'identité ou passeport) en cours de validité`,
      )
      .with(
        'personne-morale',
        () =>
          'Un extrait Kbis, pour les sociétés en cours de constitutionv une copie des statuts de la société en cours de constitution, une attestation de récépissé de dépôt de fonds pour constitution de capital social et une copie de l’acte désignant le représentant légal de la société',
      )
      .with(
        'collectivité',
        () => `Un extrait de délibération portant sur le projet objet de l'offre`,
      )
      .otherwise(
        () =>
          `Tout document officiel permettant d'attester de l'existence juridique de la personne`,
      );

  return (
    <>
      <TypeReprésentantLégalSelect
        id="typeReprésentantLégal"
        name="typeRepresentantLegal"
        label="Choisir le type de représentant légal"
        state={validationErrors.typeRepresentantLegal ? 'error' : 'default'}
        stateRelatedMessage="Le type de personne pour le représentant légal est obligatoire"
        typeReprésentantLégalActuel={typePersonne}
        onTypeReprésentantLégalSelected={(type) => {
          delete validationErrors.typeRepresentantLegal;
          selectTypePersonne(type);
          onChange && onChange({ typePersonne: type, nomReprésentantLégal, piècesJustificatives });
        }}
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
