import { DateTime } from '@potentiel-domain/common';
import { Heading2 } from '../../../../../components/atoms/headings';
import Button from '@codegouvfr/react-dsfr/Button';
import { FormattedDate } from '../../../../../components/atoms/FormattedDate';
import Alert from '@codegouvfr/react-dsfr/Alert';

type Props = {
  dateDemandeEnCours: DateTime.RawType;
  title: string;
  href: string;
};

export const RedirectionDemandePage = ({ dateDemandeEnCours, title, href }: Props) => (
  <div className="flex flex-col gap-6 w-full h-[300px]">
    <Heading2>
      Demande du <FormattedDate date={dateDemandeEnCours} /> en instruction
    </Heading2>
    <Alert
      severity="info"
      title={title}
      description="Une demande étant déjà en cours d'instruction, vous ne pouvez faire de modification."
      className="w-fit"
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
