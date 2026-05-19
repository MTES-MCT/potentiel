'use client';
import { Crisp } from 'crisp-sdk-web';
import { useEffect } from 'react';

const CrispChat = ({ websiteId }: { websiteId: string }) => {
  useEffect(() => {
    Crisp.configure(websiteId);
  });

  return null;
};

export default CrispChat;
