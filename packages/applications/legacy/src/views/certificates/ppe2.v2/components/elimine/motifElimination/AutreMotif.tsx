import { Text } from '@react-pdf/renderer';
import React from 'react';

type AutreMotifProps = {
  motifsElimination: string;
};
export const AutreMotif = ({ motifsElimination }: AutreMotifProps) => (
  <>
    <Text>
      À la suite de l'instruction par les services de la Commission de régulation de l’énergie, je
      suis au regret de vous informer que votre offre a été éliminée pour le motif suivant :
    </Text>
    <Text>« {motifsElimination} ».</Text>
    <Text>Par conséquent, cette offre n’a pas été retenue.</Text>
  </>
);
