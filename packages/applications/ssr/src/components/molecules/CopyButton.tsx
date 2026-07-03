'use client';

import { Button, type ButtonProps } from '@codegouvfr/react-dsfr/Button';
import Tooltip from '@codegouvfr/react-dsfr/Tooltip';
import clsx from 'clsx';
import { type ReactNode, useState } from 'react';

export type CopyButtonProps = {
  textToCopy: string;
  priority?: ButtonProps['priority'];
  className?: string;
  'aria-label': string;
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
  className,
  'aria-label': ariaLabel,
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
    <div className={clsx('print:hidden flex flex-row gap-1 items-center', className)}>
      {noChildren ? null : (children ?? <span className="italic">{textToCopy}</span>)}
      <Tooltip kind="hover" title="Copier">
        <Button
          iconId={hasCopied ? 'ri-check-fill' : 'ri-file-copy-2-line'}
          aria-label={ariaLabel}
          priority={priority}
          onClick={copyLink}
          size="small"
          // biome-ignore lint/correctness/noChildrenProp: si un children est présent l'icône s'affiche mal
          children={hasCopied ? 'Copié !' : undefined}
        />
      </Tooltip>
    </div>
  );
};
