import { Metadata } from 'next';

import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { ProjetBanner } from '@/components/molecules/projet/ProjetBanner';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageTemplate } from '@/components/templates/Page.template';

import { ModifierLauréatForm } from './ModifierLauréat.form';

export const metadata: Metadata = {
  title: 'Détail des garanties financières - Potentiel',
  description: 'Page de détails des garanties financières',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async () => {
      const identifiantProjet = decodeParameter(identifiant);
      return (
        <PageTemplate banner={<ProjetBanner identifiantProjet={identifiantProjet} />}>
          <ModifierLauréatForm />
        </PageTemplate>
      );
    }),
  );
}
