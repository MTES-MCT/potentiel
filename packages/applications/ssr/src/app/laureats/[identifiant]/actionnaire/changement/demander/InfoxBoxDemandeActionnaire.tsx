import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';

export const InfoBoxDemandeActionnaire: FC = () => (
  <Alert
    severity="info"
    small
    description={
      <div className="p-3">
        Votre demande de changement d'actionnaire(s) nécessite une instruction si votre projet
        remplit <span className="font-semibold">une</span> des conditions suivantes :
        <ul className="list-disc list-inside mb-2">
          <li>l'actionnariat est de type financement ou investissement participatif</li>
          <li>
            il n'y a pas de garanties financières validées sur le projet ou il y a une demande de
            renouvellement ou de modification des garanties financières en cours de traitement
          </li>
        </ul>
      </div>
    }
  />
);
