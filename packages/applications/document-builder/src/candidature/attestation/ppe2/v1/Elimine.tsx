import { Text } from '@react-pdf/renderer';
import React from 'react';

import { AttestationPPE2Options } from '../../AttestationCandidatureOptions.js';

type ElimineProps = {
  project: AttestationPPE2Options;
};

export const buildElimine = ({ project }: ElimineProps) => {
  const { appelOffre, période } = project;
  const { renvoiRetraitDesignationGarantieFinancieres, soumisAuxGarantiesFinancieres } =
    appelOffre.garantiesFinancières;

  return {
    objet: `Avis de rejet à l’issue de la ${période.title} période de l'appel d'offres ${période.cahierDesCharges.référence} ${appelOffre.title}`,
    content: (
      <>
        <Text style={{ marginTop: 10 }}>
          À la suite de l'instruction par les services de la Commission de régulation de l’énergie,
          je suis au regret de vous informer que votre offre a été éliminée pour le motif suivant :
          «{project.motifsElimination}». Par conséquent, cette offre n’a pas été retenue.
        </Text>

        {soumisAuxGarantiesFinancieres && (
          <Text style={{ marginTop: 10 }}>
            Conformément au paragraphe {renvoiRetraitDesignationGarantieFinancieres} la garantie
            financière est annulée automatiquement.
          </Text>
        )}

        <Text style={{ marginTop: 10 }}>
          Vous avez la possibilité de contester la présente décision auprès du tribunal
          administratif territorialement compétent dans un délai de deux mois à compter de sa date
          de notification.
        </Text>
      </>
    ),
    footnotes: undefined,
  };
};
