'use client';

import Button, { ButtonProps } from '@codegouvfr/react-dsfr/Button';
import { ReactNode, useState } from 'react';
import clsx from 'clsx';

export type CopyButtonProps = {
  textToCopy: string;
  timeoutInMs?: number;
  className?: string;
  prority?: ButtonProps['priority'];
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
  prority = 'secondary',
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
    <div className={clsx(`flex flex-row gap-3 items-center`, className && `${className}`)}>
      {noChildren ? null : (children ?? <span className="italic">{textToCopy}</span>)}
      <Button
        iconId={hasCopied ? 'ri-check-fill' : 'ri-clipboard-line'}
        aria-label="copier-coller"
        priority={prority}
        onClick={copyLink}
        style={{ marginTop: 0 }}
        size="small"
      >
        {hasCopied ? 'Copié !' : 'Copier'}
      </Button>
    </div>
  );
};
