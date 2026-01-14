'use client';

import { useState } from 'react';

type Props = { text: string; maxLength?: number; className?: string };

export const ReadMore = ({ text, maxLength = 100, className }: Props) => {
  const [isTruncated, setIsTruncated] = useState(true);

  if (text.length <= maxLength) {
    return <span className={className}>{text}</span>;
  }

  return (
    <>
      <span className={className}>
        {isTruncated ? `${text.substring(0, maxLength)}... ` : text}
        <span
          onClick={() => setIsTruncated(!isTruncated)}
          className="cursor-pointer text-sm text-dsfr-text-title-blueFrance-default font-medium whitespace-nowrap"
        >
          {isTruncated ? ' Voir plus' : ' Voir moins'}
        </span>
      </span>
    </>
  );
};
