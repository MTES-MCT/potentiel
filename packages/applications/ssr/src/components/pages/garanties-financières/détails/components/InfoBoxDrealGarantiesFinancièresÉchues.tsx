'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { FC, useState } from 'react';

type Props = {
  contactPorteurs: string[];
};

export const InfoBoxDrealGarantiesFinancièreséÉchues: FC<Props> = ({ contactPorteurs }) => {
  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const emails = contactPorteurs.join(', ');

  const copyLink = () => {
    navigator.clipboard.writeText(emails);
    setHasCopied(true);
  };

  return (
    <>
      <p className="italic">
        La date d'échéance de ces garanties financières est dépassée. Vous pouvez contacter le ou
        les porteurs dont voici la ou les adresses emails :
        <br />
        <div className="flex flex-row gap-3 items-center">
          <span>{emails}</span>{' '}
          <Button
            iconId="ri-clipboard-line"
            aria-label="copier-coller"
            priority="secondary"
            onClick={copyLink}
            style={{ marginTop: 0 }}
            size="small"
          >
            {hasCopied ? 'Copié !' : 'Copier'}
          </Button>
        </div>
      </p>
    </>
  );
};
