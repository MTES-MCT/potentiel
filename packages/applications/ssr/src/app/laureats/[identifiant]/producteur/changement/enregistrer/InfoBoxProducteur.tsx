import Alert from '@codegouvfr/react-dsfr/Alert';
import { FC } from 'react';
import Link from 'next/link';

import { Routes } from '@potentiel-applications/routes';

import { Heading6 } from '@/components/atoms/headings';

export const InfoBoxRévocationDesDroits: FC = () => (
  <Alert
    severity="warning"
    small
    description={
      <div className="p-1">
        <Heading6>Attention : révocation des droits sur le projet</Heading6>
        <span>
          Une fois ce changement confirmé, vous ne pourrez plus suivre ce projet sur Potentiel.
          <br />
          Tous les accès utilisateurs actuels seront retirés. <br /> Le nouveau producteur pourra
          retrouver le projet dans la liste{' '}
          <Link href={Routes.Accès.réclamerProjet} target="blank">
            "Projets à réclamer"
          </Link>
          .
        </span>
      </div>
    }
  />
);

export const InfoBoxAprèsAchèvement: FC = () => (
  <Alert
    severity="info"
    small
    description={
      <div className="p-1">
        Un changement de producteur après achèvement du projet doit être fait auprès du
        cocontractant.
      </div>
    }
  />
);
