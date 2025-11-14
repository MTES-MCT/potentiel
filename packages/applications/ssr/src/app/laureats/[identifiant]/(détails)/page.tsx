import { decodeParameter } from '@/utils/decodeParameter';

import { EtapesLauréat } from './EtapesLauréat';

type PageProps = {
  params: { identifiant: string };
};
export default function Page({ params: { identifiant } }: PageProps) {
  const identifiantProjet = decodeParameter(identifiant);
  return (
    <>
      <EtapesLauréat identifiantProjet={identifiantProjet} />
    </>
  );
}
