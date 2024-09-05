import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AppelOffre } from '@potentiel-domain/appel-offre';
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
import { récupérerProjet, vérifierQueLeProjetEstClassé } from '@/app/_helpers';

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

      const projet = await récupérerProjet(identifiantProjet.formatter());
      await vérifierQueLeProjetEstClassé({
        statut: projet.statut,
        message:
          "Vous ne pouvez pas modifier la demande complète de raccordement d'un dossier de raccordement pour un projet éliminé ou abandonné",
      });

      const referenceDossierRaccordement = decodeParameter(reference);

      const appelOffre = await mediator.send<AppelOffre.ConsulterAppelOffreQuery>({
        type: 'AppelOffre.Query.ConsulterAppelOffre',
        data: { identifiantAppelOffre: projet.appelOffre },
      });

      if (Option.isNone(appelOffre)) {
        return notFound();
      }

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

      if (Option.isNone(dossierRaccordement)) {
        return notFound();
      }

      const canEdit =
        utilisateur.role.estÉgaleÀ(Role.admin) ||
        utilisateur.role.estÉgaleÀ(Role.dgecValidateur) ||
        ((utilisateur.role.estÉgaleÀ(Role.porteur) || utilisateur.role.estÉgaleÀ(Role.dreal)) &&
          !dossierRaccordement.miseEnService);

      const props = mapToProps({
        appelOffre,
        gestionnaireRéseau,
        identifiantProjet,
        dossierRaccordement,
        canEdit,
      });

      return <ModifierDemandeComplèteRaccordementPage {...props} />;
    }),
  );
}

type MapToProps = (args: {
  appelOffre: AppelOffre.ConsulterAppelOffreReadModel;
  gestionnaireRéseau: Raccordement.ConsulterGestionnaireRéseauRaccordementReadModel;
  dossierRaccordement: Raccordement.ConsulterDossierRaccordementReadModel;
  identifiantProjet: IdentifiantProjet.ValueType;
  canEdit: boolean;
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
  canEdit,
}) => {
  return {
    identifiantProjet: identifiantProjet.formatter(),
    raccordement: {
      référence: {
        value: dossierRaccordement.référence.référence,
        canEdit,
      },
      demandeComplèteRaccordement: {
        canEdit,
        dateQualification:
          dossierRaccordement.demandeComplèteRaccordement.dateQualification?.formatter(),
        accuséRéception:
          dossierRaccordement.demandeComplèteRaccordement.accuséRéception?.formatter(),
      },
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
