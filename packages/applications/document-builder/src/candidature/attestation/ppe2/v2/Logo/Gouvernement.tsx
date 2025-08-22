import { Image } from '@react-pdf/renderer';

export const LogoGouvernement = ({ imagesRootPath }: { imagesRootPath: string }) => (
  <Image
    style={{ maxWidth: 120, marginTop: 15, marginBottom: 40 }}
    src={imagesRootPath + `/logo_gouvernement.png`}
  />
);
