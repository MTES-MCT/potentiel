import { mediator } from 'mediateur';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { mapToPlainObject } from '@potentiel-domain/core';
import { nombresEnToutesLettres } from '@potentiel-domain/inmemory-referential';
import { type CahierDesCharges, IdentifiantProjet, type Lauréat } from '@potentiel-domain/projet';
import type { GestionnaireRéseau } from '@potentiel-domain/reseau';
import type { Role } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';

import { getCahierDesCharges } from '@/app/_helpers';
import { decodeParameter } from '@/utils/decodeParameter';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getLauréatOrRedirect } from '../../../../(raccordement-du-projet)/(détails)/_helpers';
import {
  ModifierDemandeComplèteRaccordementPage,
  type ModifierDemandeComplèteRaccordementPageProps,
} from './ModifierDemandeComplèteRaccordement.page';

export const metadata: Metadata = {
  title: 'Modifier un dossier de raccordement',
};

type PageProps = {
  params: Promise<{
    identifiant: string;
    reference: string;
  }>;
};

export default async function Page(props0: PageProps) {
  const params = await props0.params;

  const { identifiant, reference } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Raccordement.ModifierDemandeComplèteRaccordementUseCase>(
        'Lauréat.Raccordement.UseCase.ModifierDemandeComplèteRaccordement',
      );
      utilisateur.rôle.peutExécuterMessage<Lauréat.Raccordement.ModifierRéférenceDossierRaccordementUseCase>(
        'Lauréat.Raccordement.UseCase.ModifierRéférenceDossierRaccordement',
      );

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      ).formatter();

      await getLauréatOrRedirect(identifiantProjet);

      const referenceDossierRaccordement = decodeParameter(reference);

      const cahierDesCharges = await getCahierDesCharges(identifiantProjet);

      const gestionnaireRéseau =
        await mediator.send<Lauréat.Raccordement.ConsulterGestionnaireRéseauRaccordementQuery>({
          type: 'Lauréat.Raccordement.Query.ConsulterGestionnaireRéseauRaccordement',
          data: { identifiantProjetValue: identifiantProjet },
        });

      const listeGestionnairesRéseau = Option.isSome(gestionnaireRéseau)
        ? undefined
        : await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
            type: 'Réseau.Gestionnaire.Query.ListerGestionnaireRéseau',
            data: {},
          });

      const dossierRaccordement =
        await mediator.send<Lauréat.Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'Lauréat.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            référenceDossierRaccordementValue: referenceDossierRaccordement,
            identifiantProjetValue: identifiantProjet,
          },
        });

      if (Option.isNone(dossierRaccordement)) {
        return notFound();
      }

      const props = mapToProps({
        role: utilisateur.rôle,
        cahierDesCharges,
        gestionnaireRéseau: Option.isSome(gestionnaireRéseau) ? gestionnaireRéseau : undefined,
        identifiantProjet,
        dossierRaccordement,
        listeGestionnairesRéseau,
      });

      return (
        <ModifierDemandeComplèteRaccordementPage
          identifiantProjet={identifiantProjet}
          raccordement={props.raccordement}
          gestionnaireRéseauActuel={props.gestionnaireRéseauActuel}
          delaiDemandeDeRaccordementEnMois={props.delaiDemandeDeRaccordementEnMois}
          listeGestionnairesRéseau={props.listeGestionnairesRéseau}
        />
      );
    }),
  );
}

type MapToProps = (args: {
  role: Role.ValueType;
  gestionnaireRéseau?: Lauréat.Raccordement.ConsulterGestionnaireRéseauRaccordementReadModel;
  dossierRaccordement: Lauréat.Raccordement.ConsulterDossierRaccordementReadModel;
  identifiantProjet: IdentifiantProjet.RawType;
  listeGestionnairesRéseau: GestionnaireRéseau.ListerGestionnaireRéseauReadModel | undefined;
  cahierDesCharges: CahierDesCharges.ValueType;
}) => ModifierDemandeComplèteRaccordementPageProps;

const mapToProps: MapToProps = ({
  cahierDesCharges,
  gestionnaireRéseau,
  dossierRaccordement,
  identifiantProjet,
  listeGestionnairesRéseau: gestionnairesRéseau,
}) => ({
  identifiantProjet,
  raccordement: {
    référence: dossierRaccordement.référence.référence,
    demandeComplèteRaccordement: {
      dateQualification:
        dossierRaccordement.demandeComplèteRaccordement.dateQualification?.formatter(),
      accuséRéception: dossierRaccordement.demandeComplèteRaccordement.accuséRéception?.formatter(),
    },
  },
  delaiDemandeDeRaccordementEnMois: {
    valeur: cahierDesCharges.getDélaiDCR().grd,
    texte: nombresEnToutesLettres[cahierDesCharges.getDélaiDCR().grd],
  },
  gestionnaireRéseauActuel: gestionnaireRéseau && mapToPlainObject(gestionnaireRéseau),
  listeGestionnairesRéseau: gestionnairesRéseau && mapToPlainObject(gestionnairesRéseau.items),
});
