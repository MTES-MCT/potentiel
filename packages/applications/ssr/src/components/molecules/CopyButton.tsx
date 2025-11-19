'use client';

import Button, { ButtonProps } from '@codegouvfr/react-dsfr/Button';
import { ReactNode, useState } from 'react';
import Tooltip from '@codegouvfr/react-dsfr/Tooltip';

export type CopyButtonProps = {
  textToCopy: string;
  priority?: ButtonProps['priority'];
} & (
  | {
      noChildren: true;
      children?: undefined;
    }
  | {
      noChildren?: undefined;
      children?: ReactNode;
    }
);

export const CopyButton = ({
  textToCopy,
  noChildren,
  children,
  priority = 'tertiary no outline',
}: CopyButtonProps) => {
  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const timeoutInMs = 2000;

  const copyLink = () => {
    navigator.clipboard.writeText(textToCopy);
    setHasCopied(true);
    setTimeout(() => {
      setHasCopied(false);
    }, timeoutInMs);
  };

  return (
    <div className="print:hidden flex flex-row gap-1 items-center">
      {noChildren ? null : (children ?? <span className="italic">{textToCopy}</span>)}
      <Tooltip kind="hover" title="Copier">
        <Button
          iconId={hasCopied ? 'ri-check-fill' : 'ri-file-copy-2-line'}
          aria-label="copier-coller"
          priority={priority}
          onClick={copyLink}
          style={{ marginTop: 0 }}
          size="small"
        >
          {hasCopied ? 'Copié !' : ''}
        </Button>
      </Tooltip>
    </div>
  );
};
