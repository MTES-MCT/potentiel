import { Metadata, ResolvingMetadata } from 'next';

import { ProjetÉliminéBanner } from '@/components/molecules/projet/éliminé/ProjetÉliminéBanner';
import { PageTemplate } from '@/components/templates/Page.template';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';

import { getProjetÉliminé } from './_helpers/getÉliminé';

type LayoutProps = IdentifiantParameter & {
  children: React.ReactNode;
};

export async function generateMetadata(
  { params }: LayoutProps,
  _: ResolvingMetadata,
): Promise<Metadata> {
  const identifiantProjet = decodeParameter(params.identifiant);
  try {
    const projet = await getProjetÉliminé(identifiantProjet);

    return {
      title: `${projet.nomProjet} - Potentiel`,
      description: 'Détails du projet éliminé',
      other: {
        nomProjet: projet.nomProjet,
      },
    };
  } catch {
    return {};
  }
}

export default function ÉliminéLayout({ children, params: { identifiant } }: LayoutProps) {
  const identifiantProjet = decodeParameter(identifiant);
  return (
    <PageTemplate banner={<ProjetÉliminéBanner identifiantProjet={identifiantProjet} />}>
      {children}
    </PageTemplate>
  );
}
