import { Text, View } from '@react-pdf/renderer';
import React from 'react';

import { AttestationCandidatureOptions } from '../AttestationCandidatureOptions';

type ElimineProps = {
  project: AttestationCandidatureOptions;
};

export const Elimine = ({ project }: ElimineProps) => {
  const { appelOffre } = project;
  const { renvoiRetraitDesignationGarantieFinancieres, soumisAuxGarantiesFinancieres } = appelOffre;

  return (
    <>
      <View style={{ marginTop: 10 }}>
        <Text>
          À la suite de l'instruction par les services de la Commission de régulation de l’énergie,
          je suis au regret de vous informer que votre offre a été éliminée pour le motif suivant :
        </Text>
        <Text>«{project.motifsElimination}».</Text>
        <Text>Par conséquent, cette offre n’a pas été retenue.</Text>
      </View>

      {soumisAuxGarantiesFinancieres && (
        <Text style={{ marginTop: 10 }}>
          Conformément au paragraphe {renvoiRetraitDesignationGarantieFinancieres} la garantie
          financière est annulée automatiquement.
        </Text>
      )}

      <Text style={{ marginTop: 10 }}>
        Vous avez la possibilité de contester la présente décision auprès du tribunal administratif
        territorialement compétent dans un délai de deux mois à compter de sa date de notification.
      </Text>
    </>
  );
};
