import Button from '@codegouvfr/react-dsfr/Button';
import Notice from '@codegouvfr/react-dsfr/Notice';

import { Heading2 } from '../headings';

type Props = {
  title: string;
  href: string;
  hrefLabel?: string;
};

export const DemandeEnCoursPage = ({
  title,
  href,
  hrefLabel = 'Voir ma demande en cours',
}: Props) => (
  <div className="flex flex-col gap-6 w-full lg:min-h-96">
    <Heading2>Demande(s) en cours</Heading2>
    <Notice
      severity="info"
      title={title}
      description="Une ou plusieurs demandes étant déjà en cours, vous ne pouvez plus faire de demande ou enregistrer une modification. Si une demande est obsolète, vous pouvez l'annuler."
      className="lg:w-1/2"
    />
    <Button
      priority="primary"
      linkProps={{
        href,
      }}
    >
      {hrefLabel}
    </Button>
  </div>
);
