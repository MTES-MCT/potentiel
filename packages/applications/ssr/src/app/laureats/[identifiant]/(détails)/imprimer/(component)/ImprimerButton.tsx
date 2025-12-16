'use client';

import { useEffect } from 'react';

export const ImprimerButton = () => {
  useEffect(() => {
    window.print();
  }, []);

  return <></>;
};
