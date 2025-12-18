import { Heading2 } from '../../../../../components/atoms/headings';
import Button from '@codegouvfr/react-dsfr/Button';
import Alert from '@codegouvfr/react-dsfr/Alert';

type Props = {
  title: string;
  href: string;
};

export const RedirectionDemandePage = ({ title, href }: Props) => (
  <div className="flex flex-col gap-6 w-full h-[300px]">
    <Heading2>Demande de changement en instruction</Heading2>
    <Alert
      severity="info"
      title={title}
      description="Une demande de changement étant déjà en cours d'instruction, vous ne pouvez plus faire de modification. Si cette demande est obsolète, vous pouvez l'annuler."
      className="w-fit"
    />
    <Button
      priority="primary"
      linkProps={{
        href,
      }}
    >
      Voir la demande de changement
    </Button>
  </div>
);
