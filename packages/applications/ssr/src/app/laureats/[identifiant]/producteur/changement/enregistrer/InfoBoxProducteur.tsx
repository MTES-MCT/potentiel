import Notice from '@codegouvfr/react-dsfr/Notice';
import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { Link } from '@/components/atoms/LinkNoPrefetch';
import type { EnregistrerChangementProducteurFormProps } from './EnregistrerChangementProducteur.form';

export const InfoBoxRévocationDesDroits: FC = () => (
  <Notice
    severity="warning"
    title="Attention : révocation des droits sur le projet"
    description={
      <>
        <br />
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
      </>
    }
  />
);

export const InfoBoxAprèsAchèvement: FC = () => (
  <Notice
    severity="info"
    title="Achèvement"
    description={
      <span className="p-1">
        <br />
        Un changement de producteur après achèvement du projet doit être fait auprès du
        cocontractant.
      </span>
    }
  />
);

type InfoBoxRenseignerOuCorrigerNuméroImmatriculationProps = {
  identifiantProjet: string;
  numéroIdentification: EnregistrerChangementProducteurFormProps['numéroIdentification'];
};

export const InfoBoxRenseignerOuCorrigerNuméroImmatriculation = ({
  identifiantProjet,
  numéroIdentification,
}: InfoBoxRenseignerOuCorrigerNuméroImmatriculationProps) => (
  <Notice
    severity="info"
    title="SIRET / SIREN"
    description={
      <span>
        <br />
        Si vous souhaitez uniquement {numéroIdentification ? 'corriger' : 'renseigner'} votre numéro
        d'identification (SIRET / SIREN), veuillez vous rendre sur le formulaire dédié.
      </span>
    }
    link={{
      linkProps: {
        href: Routes.Producteur.numéroIdentification.corriger(identifiantProjet),
      },
      text: `${numéroIdentification ? 'Corriger' : 'Renseigner'} le numéro d'identification`,
    }}
  />
);
