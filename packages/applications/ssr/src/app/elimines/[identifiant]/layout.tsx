import { ProjetÉliminéBanner } from '@/components/molecules/projet/éliminé/ProjetÉliminéBanner';
import { PageTemplate } from '@/components/templates/Page.template';
import { decodeParameter } from '@/utils/decodeParameter';

type LayoutProps = {
  children: React.ReactNode;
  params: { identifiant: string };
};

export default function ÉliminéLayout({ children, params: { identifiant } }: LayoutProps) {
  const identifiantProjet = decodeParameter(identifiant);
  return (
    <PageTemplate banner={<ProjetÉliminéBanner identifiantProjet={identifiantProjet} />}>
      {children}
    </PageTemplate>
  );
}
