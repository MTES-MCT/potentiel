'use client';

import { useEffect } from 'react';

export const ImprimerButton = () => {
  useEffect(() => {
    const timeoutInMs = 600;
    setTimeout(() => {
      window.print();
    }, timeoutInMs);
  }, []);

  return <></>;
};
