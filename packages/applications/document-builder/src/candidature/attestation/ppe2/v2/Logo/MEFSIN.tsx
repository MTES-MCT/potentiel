import { Image } from '@react-pdf/renderer';

export const LogoMEFSIN = ({ imagesRootPath }: { imagesRootPath: string }) => (
  <Image
    style={{ width: 151, height: 85, marginBottom: 40 }}
    src={`${imagesRootPath}/logo_MEFSIN.png`}
  />
);
