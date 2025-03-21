import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { PageTemplate } from '@/components/templates/Page.template';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';

type LayoutProps = IdentifiantParameter & { children: React.ReactNode };

export default async function Layout({ children, params: { identifiant } }: LayoutProps) {
  const identifiantProjet = decodeParameter(identifiant);

  return (
    <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />}>
      {children}
    </PageTemplate>
  );
}
