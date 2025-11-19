import { Metadata, ResolvingMetadata } from 'next';

import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { PageTemplate } from '@/components/templates/Page.template';
import { decodeParameter } from '@/utils/decodeParameter';
import { getLauréatInfos } from '@/app/laureats/[identifiant]/_helpers/getLauréat';
import { ProjetÉliminéBanner } from '@/components/molecules/projet/éliminé/ProjetÉliminéBanner';
import { getProjetÉliminé } from '@/app/elimines/[identifiant]/_helpers/getÉliminé';

type LayoutProps = {
  children: React.ReactNode;
  params: { identifiant: string; statut: 'laureats' | 'elimines' };
};

export async function generateMetadata(
  { params }: LayoutProps,
  _: ResolvingMetadata,
): Promise<Metadata> {
  try {
    const identifiantProjet = decodeParameter(params.identifiant);
    const projet =
      params.statut === 'laureats'
        ? await getLauréatInfos({ identifiantProjet })
        : await getProjetÉliminé(identifiantProjet);

    return {
      title: `${projet.nomProjet} - Potentiel`,
      description: "Détail de la page d'un projet",
      other: {
        nomProjet: projet.nomProjet,
      },
    };
  } catch {
    return {};
  }
}

export default function ProjetLayout({ children, params: { identifiant, statut } }: LayoutProps) {
  const identifiantProjet = decodeParameter(identifiant);
  return (
    <PageTemplate
      banner={
        statut === 'laureats' ? (
          <ProjetLauréatBanner identifiantProjet={identifiantProjet} />
        ) : (
          <ProjetÉliminéBanner identifiantProjet={identifiantProjet} />
        )
      }
    >
      {children}
    </PageTemplate>
  );
}
