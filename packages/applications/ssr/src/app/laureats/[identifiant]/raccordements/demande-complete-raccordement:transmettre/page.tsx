import { mediator } from 'mediateur';
import { Metadata } from 'next';

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
import { getPériodeAppelOffres } from '@/app/_helpers/getPériodeAppelOffres';

export const metadata: Metadata = {
  title: 'Ajouter un dossier de raccordement - Potentiel',
  description: 'Formulaire de transmission de dossier de raccordement',
};

type PageProps = IdentifiantParameter;

export default async function Page({ params: { identifiant } }: PageProps) {
  return PageWithErrorHandling(async () => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(decodeParameter(identifiant));

    await récupérerLauréatNonAbandonné(identifiantProjet.formatter());

    const { période } = await getPériodeAppelOffres(identifiantProjet);

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
