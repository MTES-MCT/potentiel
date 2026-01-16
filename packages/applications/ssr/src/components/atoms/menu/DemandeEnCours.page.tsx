import Button from '@codegouvfr/react-dsfr/Button';
import Alert from '@codegouvfr/react-dsfr/Alert';

import { Heading2 } from '../headings';

type Props = {
  title: string;
  href: string;
};

export const DemandeEnCoursPage = ({ title, href }: Props) => (
  <div className="flex flex-col gap-6 w-full lg:min-h-96">
    <Heading2>Demande en cours</Heading2>
    <Alert
      severity="info"
      title={title}
      description="Une demande étant déjà en cours, vous ne pouvez plus faire de demande ou enregistrer une modification. Si cette demande est obsolète, vous pouvez l'annuler."
      className="lg:w-1/2"
    />
    <Button
      priority="primary"
      linkProps={{
        href,
      }}
    >
      Voir la demande en cours
    </Button>
  </div>
);
