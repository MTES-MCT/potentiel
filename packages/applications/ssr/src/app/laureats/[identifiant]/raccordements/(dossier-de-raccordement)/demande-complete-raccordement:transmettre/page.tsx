import { mediator } from 'mediateur';
import { Metadata } from 'next';

import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Option } from '@potentiel-libraries/monads';

import { getPériodeAppelOffres, récupérerLauréatSansAbandon } from '@/app/_helpers';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { TransmettreDemandeComplèteRaccordementPage } from './TransmettreDemandeComplèteRaccordement.page';

export const metadata: Metadata = { title: 'Ajouter un dossier de raccordement' };

type PageProps = IdentifiantParameter;

export default async function Page(props: PageProps) {
  const params = await props.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Raccordement.TransmettreDemandeComplèteRaccordementUseCase>(
        'Lauréat.Raccordement.UseCase.TransmettreDemandeComplèteRaccordement',
      );
      utilisateur.rôle.peutExécuterMessage<Lauréat.Raccordement.ModifierGestionnaireRéseauRaccordementUseCase>(
        'Lauréat.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement',
      );

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      await récupérerLauréatSansAbandon(identifiantProjet.formatter());

      const { période } = await getPériodeAppelOffres(identifiantProjet.formatter());

      const gestionnairesRéseau =
        await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
          type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
          data: {},
        });

      const gestionnaireRéseauActuel =
        await mediator.send<Lauréat.Raccordement.ConsulterGestionnaireRéseauRaccordementQuery>({
          type: 'Lauréat.Raccordement.Query.ConsulterGestionnaireRéseauRaccordement',
          data: { identifiantProjetValue: identifiantProjet.formatter() },
        });

      const raccordements = await mediator.send<Lauréat.Raccordement.ConsulterRaccordementQuery>({
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
    }),
  );
}
