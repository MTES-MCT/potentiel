import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import {
  ConsulterAppelOffreQuery,
  ConsulterAppelOffreReadModel,
} from '@potentiel-domain/appel-offre';
import { Raccordement } from '@potentiel-domain/reseau';
import { Role } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/common';

import {
  ModifierDemandeComplèteRaccordementPage,
  ModifierDemandeComplèteRaccordementPageProps,
} from '@/components/pages/réseau/raccordement/modifier/modifierDemandeComplèteRaccordement/ModifierDemandeComplèteRaccordement.page';
import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { AuthenticatedUserReadModel } from '@/utils/getAuthenticatedUser.handler';

export const metadata: Metadata = {
  title: 'Modifier un dossier de raccordement - Potentiel',
  description: `Formulaire de modification d'un dossier de raccordement`,
};

type PageProps = {
  params: {
    identifiant: IdentifiantParameter['params']['identifiant'];
    reference: string;
  };
};

export default async function Page({ params: { identifiant, reference } }: PageProps) {
  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );
      const referenceDossierRaccordement = decodeParameter(reference);

      const appelOffre = await mediator.send<ConsulterAppelOffreQuery>({
        type: 'AppelOffre.Query.ConsulterAppelOffre',
        data: { identifiantAppelOffre: identifiantProjet.appelOffre },
      });

      const gestionnaireRéseau =
        await mediator.send<Raccordement.ConsulterGestionnaireRéseauRaccordementQuery>({
          type: 'Réseau.Raccordement.Query.ConsulterGestionnaireRéseauRaccordement',
          data: { identifiantProjetValue: identifiantProjet.formatter() },
        });

      if (Option.isNone(gestionnaireRéseau)) {
        return notFound();
      }

      const dossierRaccordement =
        await mediator.send<Raccordement.ConsulterDossierRaccordementQuery>({
          type: 'Réseau.Raccordement.Query.ConsulterDossierRaccordement',
          data: {
            référenceDossierRaccordementValue: referenceDossierRaccordement,
            identifiantProjetValue: identifiantProjet.formatter(),
          },
        });

      const props = mapToProps({
        appelOffre,
        gestionnaireRéseau,
        identifiantProjet,
        dossierRaccordement,
        utilisateur,
      });

      return <ModifierDemandeComplèteRaccordementPage {...props} />;
    }),
  );
}

type MapToProps = (args: {
  appelOffre: ConsulterAppelOffreReadModel;
  gestionnaireRéseau: Raccordement.ConsulterGestionnaireRéseauRaccordementReadModel;
  dossierRaccordement: Raccordement.ConsulterDossierRaccordementReadModel;
  utilisateur: AuthenticatedUserReadModel;
  identifiantProjet: IdentifiantProjet.ValueType;
}) => ModifierDemandeComplèteRaccordementPageProps;

const mapToProps: MapToProps = ({
  appelOffre,
  gestionnaireRéseau: {
    aideSaisieRéférenceDossierRaccordement: { expressionReguliere, format, légende },
    identifiantGestionnaireRéseau,
    raisonSociale,
  },
  dossierRaccordement,
  identifiantProjet,
  utilisateur,
}) => {
  return {
    identifiantProjet: identifiantProjet.formatter(),
    raccordement: {
      référence: dossierRaccordement.référence.référence,
      demandeComplèteRaccordement: {
        dateQualification:
          dossierRaccordement.demandeComplèteRaccordement.dateQualification?.formatter(),
        accuséRéception:
          dossierRaccordement.demandeComplèteRaccordement.accuséRéception?.formatter(),
      },
      canEditRéférence:
        utilisateur.role.estÉgaleÀ(Role.admin) ||
        utilisateur.role.estÉgaleÀ(Role.dgecValidateur) ||
        (utilisateur.role.estÉgaleÀ(Role.porteur) && !dossierRaccordement.miseEnService),
    },
    delaiDemandeDeRaccordementEnMois: appelOffre.periodes.find(
      (periode) => periode.id === identifiantProjet.période,
    )!.delaiDcrEnMois,
    gestionnaireRéseauActuel: {
      identifiantGestionnaireRéseau: identifiantGestionnaireRéseau.formatter(),
      raisonSociale: raisonSociale,
      aideSaisieRéférenceDossierRaccordement: {
        expressionReguliere: expressionReguliere.formatter(),
        format: Option.match(format)
          .some((f) => f)
          .none(() => ''),
        légende: Option.match(légende)
          .some((l) => l)
          .none(() => ''),
      },
    },
  };
};
