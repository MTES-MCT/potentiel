import { Image } from '@react-pdf/renderer';

export const LogoMCE = ({ imagesRootPath }: { imagesRootPath: string }) => (
  <Image
    style={{ maxWidth: 151, maxHeight: 85, marginTop: 15, marginBottom: 40 }}
    src={`${imagesRootPath}/logo_MCE.png`}
  />
);
