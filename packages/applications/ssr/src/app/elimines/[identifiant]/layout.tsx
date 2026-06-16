import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { getProjetLauréatOuÉliminé } from '@/app/_helpers';
import { getÉliminé } from '@/app/_helpers/getÉliminé';
import { ProjetLauréatBanner } from '@/components/molecules/projet/lauréat/ProjetLauréatBanner';
import { ProjetÉliminéBanner } from '@/components/molecules/projet/éliminé/ProjetÉliminéBanner';
import { PageTemplate } from '@/components/templates/Page.template';
import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';

type LayoutProps = IdentifiantParameter & {
  children: React.ReactNode;
};

export async function generateMetadata(
  props: LayoutProps,
  _: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(
    decodeParameter(params.identifiant),
  ).formatter();
  try {
    const projet = await getÉliminé(identifiantProjet);
    if (!projet) {
      notFound();
    }

    return {
      title: {
        template: `%s - ${projet.nomProjet} | Potentiel`,
        default: projet.nomProjet,
      },
    };
  } catch {
    return {};
  }
}

export default async function ÉliminéLayout(props: LayoutProps) {
  const params = await props.params;

  const { identifiant } = params;

  const { children } = props;

  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      decodeParameter(identifiant),
    ).formatter();

    const projet = await getProjetLauréatOuÉliminé(identifiantProjet);

    return (
      <PageTemplate
        banner={
          projet.lauréat ? (
            <ProjetLauréatBanner
              identifiantProjet={identifiantProjet}
              projet={mapToPlainObject(projet.lauréat)}
            />
          ) : (
            <ProjetÉliminéBanner
              identifiantProjet={identifiantProjet}
              projet={mapToPlainObject(projet.éliminé)}
            />
          )
        }
      >
        {children}
      </PageTemplate>
    );
  });
}
