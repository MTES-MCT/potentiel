'use client';
import { FC } from 'react';
import { match } from 'ts-pattern';

import { ReprésentantLégal } from '@potentiel-domain/laureat';

import { ValidationErrors } from '@/utils/formAction';
import { UploadNewOrModifyExistingDocument } from '@/components/atoms/form/document/UploadNewOrModifyExistingDocument';

import { DemanderChangementReprésentantLégalFormKeys } from '../../changement/demander/demanderChangementReprésentantLégal.action';

export type SaisiePièceJustificativeProps = {
  typeReprésentantLégal: ReprésentantLégal.TypeReprésentantLégal.RawType;
  onChange?: (piècesJustificative: Array<string>) => void;
  validationErrors: ValidationErrors<DemanderChangementReprésentantLégalFormKeys>;
};

export const SaisiePièceJustificativeStep: FC<SaisiePièceJustificativeProps> = ({
  typeReprésentantLégal,
  validationErrors,
  onChange,
}) => {
  const getPièceJustificativeHintText = () =>
    match(typeReprésentantLégal)
      .returnType<string>()
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
    <UploadNewOrModifyExistingDocument
      label={'Pièce justificative'}
      name="piecesJustificatives"
      hintText={getPièceJustificativeHintText()}
      required
      formats={['pdf']}
      multiple
      state={validationErrors['piecesJustificatives'] ? 'error' : 'default'}
      stateRelatedMessage={validationErrors['piecesJustificatives']}
      onChange={(piècesJustificatives) => {
        delete validationErrors['piecesJustificatives'];
        onChange && onChange(piècesJustificatives);
      }}
    />
  );
};
