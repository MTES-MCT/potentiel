import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';

import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { redirectAvecSearchParams, PageDeRedirectionProps } from '@/utils/redirectAvecSearchParams';

export const metadata: Metadata = { title: `Recours` };

// Page de redirection vers la dernière de recours du projet
export default async function Page(props: PageDeRedirectionProps) {
  const { identifiant } = await props.params;
  const searchParams = await props.searchParams;

  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      decodeParameter(identifiant),
    ).formatter();

    const recours = await mediator.send<Éliminé.Recours.ConsulterRecoursQuery>({
      type: 'Éliminé.Recours.Query.ConsulterRecours',
      data: {
        identifiantProjetValue: identifiantProjet,
      },
    });

    if (Option.isNone(recours)) {
      return notFound();
    }

    const détailDemande = await mediator.send<Éliminé.Recours.ConsulterDemandeRecoursQuery>({
      type: 'Éliminé.Recours.Query.ConsulterDemandeRecours',
      data: {
        identifiantProjetValue: identifiantProjet,
        dateDemandeValue: recours.dateDemande.formatter(),
      },
    });

    if (Option.isNone(détailDemande)) {
      return notFound();
    }

    return redirectAvecSearchParams(
      Routes.Recours.détail(identifiantProjet, détailDemande.demande.demandéLe.formatter()),
      searchParams,
    );
  });
}
