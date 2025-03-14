'use client';

import Button from '@codegouvfr/react-dsfr/Button';
import { useState } from 'react';

export type CopyButtonProps = {
  textToCopy: string;
  timeoutInMs?: number;
  children?: React.ReactNode;
};

export const CopyButton = ({ textToCopy, children, timeoutInMs = 2000 }: CopyButtonProps) => {
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  const copyLink = () => {
    navigator.clipboard.writeText(textToCopy);
    setHasCopied(true);
    setTimeout(() => {
      setHasCopied(false);
    }, timeoutInMs);
  };

  return (
    <div className="flex flex-row gap-3 items-center">
      {children ? children : <span className="italic">{textToCopy}</span>}
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
  );
};
