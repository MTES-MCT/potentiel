'use client';

import Button, { ButtonProps } from '@codegouvfr/react-dsfr/Button';
import { ReactNode, useState } from 'react';
import clsx from 'clsx';
import Tooltip from '@codegouvfr/react-dsfr/Tooltip';

export type CopyButtonProps = {
  textToCopy: string;
  timeoutInMs?: number;
  className?: string;
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
  timeoutInMs = 2000,
  className,
  noChildren,
  children,
  priority = 'tertiary no outline',
}: CopyButtonProps) => {
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  const copyLink = () => {
    navigator.clipboard.writeText(textToCopy);
    setHasCopied(true);
    setTimeout(() => {
      setHasCopied(false);
    }, timeoutInMs);
  };

  return (
    <Tooltip
      kind="hover"
      title="Copier"
      className={clsx(`print:hidden flex flex-row gap-3 items-center`, className)}
    >
      {noChildren ? null : (children ?? <span className="italic">{textToCopy}</span>)}
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
  );
};
