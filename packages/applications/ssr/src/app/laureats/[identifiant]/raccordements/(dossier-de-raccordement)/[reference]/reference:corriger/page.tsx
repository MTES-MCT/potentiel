import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Lauréat } from '@potentiel-domain/projet';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { récupérerLauréatNonAbandonné } from '@/app/_helpers';

import { CorrigerRéférenceDossierPage } from './CorrigerRéférenceDossier.page';

export const metadata: Metadata = {
  title: 'Corriger une référence de dossier de raccordement - Potentiel',
  description: `Formulaire de modification d'une référence dossier de raccordement`,
};

type PageProps = IdentifiantParameter & {
  params: {
    reference: string;
  };
};

export default async function Page({ params: { identifiant, reference } }: PageProps) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));
    await récupérerLauréatNonAbandonné(identifiantProjet.formatter());

    const referenceDossierRaccordement = decodeParameter(reference);

    const gestionnaireRéseau =
      await mediator.send<Lauréat.Raccordement.ConsulterGestionnaireRéseauRaccordementQuery>({
        type: 'Lauréat.Raccordement.Query.ConsulterGestionnaireRéseauRaccordement',
        data: { identifiantProjetValue: identifiantProjet.formatter() },
      });

    if (Option.isNone(gestionnaireRéseau)) {
      return notFound();
    }

    const dossierRaccordement =
      await mediator.send<Lauréat.Raccordement.ConsulterDossierRaccordementQuery>({
        type: 'Lauréat.Raccordement.Query.ConsulterDossierRaccordement',
        data: {
          référenceDossierRaccordementValue: referenceDossierRaccordement,
          identifiantProjetValue: identifiantProjet.formatter(),
        },
      });

    if (Option.isNone(dossierRaccordement)) {
      return notFound();
    }

    return (
      <CorrigerRéférenceDossierPage
        identifiantProjet={identifiantProjet.formatter()}
        gestionnaireRéseau={mapToPlainObject(gestionnaireRéseau)}
        dossierRaccordement={mapToPlainObject(dossierRaccordement)}
      />
    );
  });
}
