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
      <span className={className}>{isTruncated ? `${text.substring(0, maxLength)}...` : text}</span>
      <button onClick={() => setIsTruncated(!isTruncated)} className="text-theme-blueFrance ml-2">
        {isTruncated ? 'Voir plus' : 'Voir moins'}
      </button>
    </>
  );
};
