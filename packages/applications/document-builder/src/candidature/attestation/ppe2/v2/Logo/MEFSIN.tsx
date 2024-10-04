import { Image } from '@react-pdf/renderer';
import React from 'react';

export const LogoMEFSIN = ({ imagesRootPath }: { imagesRootPath: string }) => (
  <Image
    style={{ width: 151, height: 85, marginBottom: 40 }}
    src={imagesRootPath + `/logo_MEFSIN.png`}
  />
);
