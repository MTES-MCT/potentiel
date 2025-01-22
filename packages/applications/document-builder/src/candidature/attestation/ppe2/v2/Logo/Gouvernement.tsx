import { Image } from '@react-pdf/renderer';
import React from 'react';

export const LogoGouvernement = ({ imagesRootPath }: { imagesRootPath: string }) => (
  <Image
    style={{ maxWidth: 120, marginBottom: 40 }}
    src={imagesRootPath + `/logo_gouvernement.png`}
  />
);
