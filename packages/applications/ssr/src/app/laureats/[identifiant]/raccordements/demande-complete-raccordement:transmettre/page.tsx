import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Raccordement } from '@potentiel-domain/laureat';

import { TransmettreDemandeComplèteRaccordementPage } from '@/components/pages/réseau/raccordement/transmettre/transmettreDemandeComplèteRaccordement/TransmettreDemandeComplèteRaccordement.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { récupérerLauréatNonAbandonné } from '@/app/_helpers';

export const metadata: Metadata = {
  title: 'Ajouter un dossier de raccordement - Potentiel',
  description: 'Formulaire de transmission de dossier de raccordement',
};

type PageProps = IdentifiantParameter;

export default async function Page({ params: { identifiant } }: PageProps) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

    await récupérerLauréatNonAbandonné(identifiantProjet.formatter());

    const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
      type: 'AppelOffre.Query.ConsulterAppelOffre',
      data: { identifiantAppelOffre: identifiantProjet.appelOffre },
    });

    if (Option.isNone(appelOffre)) {
      return notFound();
    }
    const période = appelOffre.periodes.find(
      (appelOffre) => appelOffre.id === identifiantProjet.période,
    );
    if (!période) {
      return notFound();
    }

    const gestionnairesRéseau =
      await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
        type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
        data: {},
      });

    const gestionnaireRéseauActuel =
      await mediator.send<Raccordement.ConsulterGestionnaireRéseauRaccordementQuery>({
        type: 'Lauréat.Raccordement.Query.ConsulterGestionnaireRéseauRaccordement',
        data: { identifiantProjetValue: identifiantProjet.formatter() },
      });

    const raccordements = await mediator.send<Raccordement.ConsulterRaccordementQuery>({
      type: 'Lauréat.Raccordement.Query.ConsulterRaccordement',
      data: { identifiantProjetValue: identifiantProjet.formatter() },
    });

    const aDéjàTransmisUneDemandeComplèteDeRaccordement =
      Option.isSome(raccordements) && raccordements.dossiers.length > 0;

    return (
      <TransmettreDemandeComplèteRaccordementPage
        aDéjàTransmisUneDemandeComplèteDeRaccordement={
          aDéjàTransmisUneDemandeComplèteDeRaccordement
        }
        identifiantProjet={mapToPlainObject(identifiantProjet)}
        listeGestionnairesRéseau={mapToPlainObject(gestionnairesRéseau.items)}
        gestionnaireRéseauActuel={mapToPlainObject(gestionnaireRéseauActuel)}
        delaiDemandeDeRaccordementEnMois={période.delaiDcrEnMois}
      />
    );
  });
}
