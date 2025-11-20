import { Metadata, ResolvingMetadata } from 'next';

import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { PageTemplate } from '@/components/templates/Page.template';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';

import { getLauréatInfos } from './_helpers/getLauréat';

type LayoutProps = {
  children: React.ReactNode;
  params: { identifiant: string };
};

export async function generateMetadata(
  { params }: IdentifiantParameter,
  _: ResolvingMetadata,
): Promise<Metadata> {
  try {
    const identifiantProjet = decodeParameter(params.identifiant);
    const lauréat = await getLauréatInfos({ identifiantProjet });

    return {
      title: `${lauréat.nomProjet} - Potentiel`,
      description: "Détail de la page d'un projet",
      other: {
        nomProjet: lauréat.nomProjet,
      },
    };
  } catch {
    return {};
  }
}

export default function LauréatLayout({ children, params: { identifiant } }: LayoutProps) {
  const identifiantProjet = decodeParameter(identifiant);
  return (
    <PageTemplate banner={<ProjetLauréatBanner identifiantProjet={identifiantProjet} />}>
      {children}
    </PageTemplate>
  );
}
