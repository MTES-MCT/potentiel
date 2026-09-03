import Notice from '@codegouvfr/react-dsfr/Notice';
import type { FC } from 'react';

// viovio à vérifier
export const InfoBoxDemandeActionnaire: FC = () => (
  <Notice
    severity="info"
    title=""
    description={
      <span className="p-3">
        Votre demande de changement d'actionnaire(s) nécessite une instruction si votre projet
        remplit <span className="font-semibold">une</span> des conditions suivantes :
        <span className="list-disc list-inside mb-2">
          <span>l'actionnariat est de type financement ou investissement participatif</span>
          <span>
            il n'y a pas de garanties financières validées sur le projet ou il y a une demande de
            renouvellement ou de modification des garanties financières en cours de traitement
          </span>
        </span>
      </span>
    }
  />
);
