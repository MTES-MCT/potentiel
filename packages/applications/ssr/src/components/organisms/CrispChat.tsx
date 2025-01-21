'use client';
import { useEffect } from 'react';
import { Crisp } from 'crisp-sdk-web';

const CrispChat = ({ websiteId }: { websiteId: string }) => {
  useEffect(() => {
    Crisp.configure(websiteId);
  });

  return null;
};

export default CrispChat;
