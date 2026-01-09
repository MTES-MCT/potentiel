import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { ProjetÉliminéBanner } from '@/components/molecules/projet/éliminé/ProjetÉliminéBanner';
import { PageTemplate } from '@/components/templates/Page.template';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { getÉliminé } from '@/app/_helpers/getÉliminé';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { getLauréatInfos } from '@/app/laureats/[identifiant]/_helpers';
import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';

type LayoutProps = IdentifiantParameter & {
  children: React.ReactNode;
};

export async function generateMetadata(
  { params }: LayoutProps,
  _: ResolvingMetadata,
): Promise<Metadata> {
  const identifiantProjet = decodeParameter(params.identifiant);
  try {
    const projet = await getÉliminé(identifiantProjet);
    if (!projet) {
      notFound();
    }

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

export default async function ÉliminéLayout({ children, params: { identifiant } }: LayoutProps) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = decodeParameter(identifiant);
    const éliminé = await getÉliminé(identifiantProjet);

    // dans le cas d'un recours accordé, le projet devient lauréat
    if (!éliminé) {
      const lauréat = await getLauréatInfos(
        IdentifiantProjet.convertirEnValueType(identifiantProjet).formatter(),
      );
      return (
        <ProjetLauréatBanner
          identifiantProjet={identifiantProjet}
          projet={mapToPlainObject(lauréat)}
        />
      );
    }
    return (
      <PageTemplate
        banner={
          <ProjetÉliminéBanner
            identifiantProjet={identifiantProjet}
            projet={mapToPlainObject(éliminé)}
          />
        }
      >
        {children}
      </PageTemplate>
    );
  });
}
