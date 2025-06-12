import { FC } from 'react';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { PlainType } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

export type AlerteChangementÉvaluationCarboneProps =
  PlainType<Lauréat.Fournisseur.NoteÉvaluationCarbone.ValueType>;

export const AlerteChangementÉvaluationCarbone: FC<AlerteChangementÉvaluationCarboneProps> = (
  props,
) => {
  const noteECS = Lauréat.Fournisseur.NoteÉvaluationCarbone.bind(props);

  return noteECS.estDégradée() ? (
    <Alert
      className="mt-2"
      severity="warning"
      small
      description={
        <div>
          Si la modification de la valeur de l'évaluation carbone était susceptible d'entrainer une
          dégradation de la note à la candidature, la remise de l'attestation de conformité pourrait
          être compromise.
        </div>
      }
    />
  ) : null;
};
