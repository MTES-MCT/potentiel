import { FC } from 'react';

import { CopyButton } from '@/components/molecules/CopyButton';

type Props = {
  contactPorteurs: string[];
};

export const InfoBoxDrealGarantiesFinancièreséÉchues: FC<Props> = ({ contactPorteurs }) => {
  const emails = contactPorteurs.join(', ');

  return (
    <p>
      La date d'échéance de ces garanties financières est dépassée. Vous pouvez contacter le ou les
      porteurs dont voici la ou les adresses emails :
      <br />
      <CopyButton textToCopy={emails} />
    </p>
  );
};
