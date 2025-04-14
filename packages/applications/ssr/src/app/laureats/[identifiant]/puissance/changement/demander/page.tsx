import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Option } from '@potentiel-libraries/monads';
import { CahierDesCharges, Puissance } from '@potentiel-domain/laureat';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { mapToPlainObject } from '@potentiel-domain/core';
import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Candidature } from '@potentiel-domain/candidature';

import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { DemanderChangementPuissancePage } from '@/components/pages/puissance/changement/demander/DemanderChangementPuissance.page';

export const metadata: Metadata = {
  title: 'Demander le changement de puissance du projet - Potentiel',
  description: 'Formulaire de demande de changement de puissance du projet',
};

export default async function Page({ params: { identifiant } }: IdentifiantParameter) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

    const puissanceActuel = await mediator.send<Puissance.ConsulterPuissanceQuery>({
      type: 'Lauréat.Puissance.Query.ConsulterPuissance',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });

    if (Option.isNone(puissanceActuel)) {
      return notFound();
    }

    const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
      type: 'Candidature.Query.ConsulterCandidature',
      data: {
        identifiantProjet: identifiantProjet.formatter(),
      },
    });

    if (Option.isNone(candidature)) {
      return notFound();
    }

    // Après migration aggregate root, à remplacer
    const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: {
        identifiantAppelOffre: identifiantProjet.appelOffre,
      },
    });

    if (Option.isNone(appelOffre)) {
      return notFound();
    }

    const période = appelOffre.periodes.find((p) => p.id === identifiantProjet.période);

    if (!période) {
      return notFound();
    }

    // Après migration cahier des charges, à remplacer
    const cahierDesChargesChoisi =
      await mediator.send<CahierDesCharges.ConsulterCahierDesChargesChoisiQuery>({
        type: 'Lauréat.CahierDesCharges.Query.ConsulterCahierDesChargesChoisi',
        data: {
          identifiantProjet: identifiantProjet.formatter(),
        },
      });

    if (Option.isNone(cahierDesChargesChoisi)) {
      return notFound();
    }

    return (
      <DemanderChangementPuissancePage
        identifiantProjet={mapToPlainObject(puissanceActuel.identifiantProjet)}
        puissance={puissanceActuel.puissance}
        appelOffre={mapToPlainObject(appelOffre)}
        période={mapToPlainObject(période)}
        technologie={candidature.technologie.type}
        famille={période.familles.find((f) => f.id === identifiantProjet.famille)}
        cahierDesCharges={mapToPlainObject(cahierDesChargesChoisi)}
        note={candidature.noteTotale}
      />
    );
  });
}
