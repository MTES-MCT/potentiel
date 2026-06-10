import Notice from '@codegouvfr/react-dsfr/Notice';
import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { Link } from '@/components/atoms/LinkNoPrefetch';

export const InfoBoxRévocationDesDroits: FC = () => (
  <Notice
    severity="warning"
    title="Attention : révocation des droits sur le projet"
    description={
      <div>
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
  <Notice
    severity="info"
    title="Achèvement"
    description={
      <div className="p-1">
        Un changement de producteur après achèvement du projet doit être fait auprès du
        cocontractant.
      </div>
    }
  />
);

export const InfoBoxCorrection = ({ identifiantProjet }: { identifiantProjet: string }) => (
  <Notice
    severity="info"
    title="SIRET / SIREN"
    description={
      <div>
        Si vous souhaitez uniquement corriger votre numéro d'identification (SIRET / SIREN),
        veuillez vous rendre sur le formulaire dédié.
      </div>
    }
    link={{
      linkProps: {
        href: Routes.Producteur.numéroIdentification.corriger(identifiantProjet),
      },
      text: "Corriger le numéro d'identification",
    }}
  />
);
