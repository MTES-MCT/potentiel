import { Metadata, ResolvingMetadata } from 'next';

import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { PageTemplate } from '@/components/templates/Page.template';
import { decodeParameter } from '@/utils/decodeParameter';
import { getLauréatInfos } from '@/app/laureats/[identifiant]/_helpers/getLauréat';
import { getProjetÉliminé } from '@/app/projets/[identifiant]/_helpers/getÉliminé';
import { ProjetÉliminéBanner } from '@/components/molecules/projet/éliminé/ProjetÉliminéBanner';

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
    const lauréat =
      params.statut === 'laureats'
        ? await getLauréatInfos({ identifiantProjet })
        : await getProjetÉliminé(identifiantProjet);

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

export default function LauréatLayout({ children, params: { identifiant, statut } }: LayoutProps) {
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
