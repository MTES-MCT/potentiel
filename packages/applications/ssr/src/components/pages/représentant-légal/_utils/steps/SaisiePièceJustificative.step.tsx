'use client';
import { FC } from 'react';
import { match, P } from 'ts-pattern';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { ValidationErrors } from '@/utils/formAction';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';

import { DemanderChangementReprésentantLégalFormKeys } from '../../changement/demander/demanderChangementReprésentantLégal.action';

import { TypeSociété } from './SaisieTypeSociété.step';

export type SaisiePièceJustificativeProps = {
  typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.RawType;
  typeSociété?: TypeSociété;
  pièceJustificative?: Array<string>;
  onChange?: (piècesJustificative: Array<string>) => void;
  validationErrors: ValidationErrors<DemanderChangementReprésentantLégalFormKeys>;
};

export const SaisiePièceJustificativeStep: FC<SaisiePièceJustificativeProps> = ({
  typeReprésentantLégal,
  typeSociété,
  pièceJustificative,
  validationErrors,
  onChange,
}) => {
  const getPièceJustificativeHintText = () =>
    match({ typeReprésentantLégal, typeSociété })
      .with(
        { typeReprésentantLégal: 'personne-physique' },
        () => `Une copie de titre d'identité (carte d'identité ou passeport) en cours de validité`,
      )
      .with(
        { typeReprésentantLégal: 'personne-morale', typeSociété: 'constituée' },
        () => `Un extrait Kbis`,
      )
      .with(
        {
          typeReprésentantLégal: 'personne-morale',
          typeSociété: P.union('en cours de constitution', 'non renseignée'),
        },
        () =>
          `Une copie des statuts de la société en cours de constitution, une attestation de récépissé de dépôt de fonds pour constitution de capital social et une copie de l’acte désignant le représentant légal de la société`,
      )
      .with(
        { typeReprésentantLégal: 'collectivité' },
        () => `Un extrait de délibération portant sur le projet`,
      )
      .otherwise(
        () =>
          `Tout document officiel permettant d'attester de l'existence juridique de l'organisme`,
      );

  return (
    <UploadNewOrModifyExistingDocument
      label={'Pièce justificative'}
      name="piecesJustificatives"
      hintText={getPièceJustificativeHintText()}
      required
      formats={['pdf']}
      multiple={typeSociété !== 'constituée' ? true : undefined}
      state={validationErrors['piecesJustificatives'] ? 'error' : 'default'}
      stateRelatedMessage={validationErrors['piecesJustificatives']}
      onChange={(piècesJustificatives) => {
        delete validationErrors['piecesJustificatives'];
        onChange && onChange(piècesJustificatives);
      }}
      documentKeys={pièceJustificative}
    />
  );
};
