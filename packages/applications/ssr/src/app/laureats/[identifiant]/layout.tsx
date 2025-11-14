import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { PageTemplate } from '@/components/templates/Page.template';
import { decodeParameter } from '@/utils/decodeParameter';

type LayoutProps = {
  children: React.ReactNode;
  params: { identifiant: string };
};

export default function LauréatLayout({ children, params: { identifiant } }: LayoutProps) {
  const identifiantProjet = decodeParameter(identifiant);
  return (
    <PageTemplate banner={<ProjetLauréatBanner identifiantProjet={identifiantProjet} />}>
      {children}
    </PageTemplate>
  );
}
