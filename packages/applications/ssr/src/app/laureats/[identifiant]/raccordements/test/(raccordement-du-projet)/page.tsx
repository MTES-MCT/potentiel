import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { decodeParameter } from '@/utils/decodeParameter';
import type { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { getLauréatOrRedirect } from '../../(raccordement-du-projet)/(détails)/_helpers';
import { DétailsRaccordementDuProjetPage } from './DétailsRaccordementDuProjetPage';

type PageProps = IdentifiantParameter;

export const metadata: Metadata = { title: 'Raccordement du projet' };

export default async function Page(props: PageProps) {
  const params = await props.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));
    const lauréat = await getLauréatOrRedirect(identifiantProjet.formatter());

    const raccordement = await mediator.send<Lauréat.Raccordement.ConsulterRaccordementQuery>({
      type: 'Lauréat.Raccordement.Query.ConsulterRaccordement',
      data: {
        identifiantProjetValue: identifiantProjet.formatter(),
      },
    });

    if (Option.isNone(raccordement)) {
      return notFound();
    }

    return (
      <DétailsRaccordementDuProjetPage
        identifiantProjet={identifiantProjet.formatter()}
        estProjetAchevé={lauréat.statut.estAchevé()}
      />
    );
  });
}
