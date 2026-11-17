import Notice from '@codegouvfr/react-dsfr/Notice';
import type { FC } from 'react';

import { Routes } from '@potentiel-applications/routes';

import { Link } from '@/components/atoms/LinkNoPrefetch';
import type { EnregistrerChangementProducteurFormProps } from './EnregistrerChangementProducteur.form';

type InfoBoxProps = {
  title: string;
  showAlerteGarantiesFinancières: boolean;
};

export const InfoBoxRévocationDesDroits = ({
  title,
  showAlerteGarantiesFinancières,
}: InfoBoxProps) => (
  <Notice
    severity="info"
    title={title}
    description={
      <>
        <br />
        <span>
          En confirmant ce changement de producteur, vous perdrez immédiatement vos accès au projet
          et ne pourrez plus effectuer de modification. <br />
          Le nouveau producteur pourra récupérer le projet via l'onglet{' '}
          <Link href={Routes.Accès.réclamerProjet}>"Projets à réclamer"</Link>.
          {showAlerteGarantiesFinancières && (
            <>
              <br />
              Des garanties financières étant en cours sur ce projet, vous devrez adresser votre
              demande de mainlevée hors Potentiel, directement à votre DREAL.
            </>
          )}
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
