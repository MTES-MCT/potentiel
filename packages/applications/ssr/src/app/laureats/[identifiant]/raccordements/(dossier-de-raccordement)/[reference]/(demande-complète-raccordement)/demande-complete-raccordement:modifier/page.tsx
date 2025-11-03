import { mediator } from 'mediateur';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AppelOffre } from '@potentiel-domain/appel-offre';
import { Lauréat } from '@potentiel-domain/projet';
import { Role } from '@potentiel-domain/utilisateur';
import { Option } from '@potentiel-libraries/monads';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { PageWithErrorHandling } from '@/utils/PageWithErrorHandling';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getPériodeAppelOffres, récupérerLauréatNonAbandonné } from '@/app/_helpers';

import {
  ModifierDemandeComplèteRaccordementPage,
  ModifierDemandeComplèteRaccordementPageProps,
} from './ModifierDemandeComplèteRaccordement.page';

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

      await récupérerLauréatNonAbandonné(identifiantProjet.formatter());

      const referenceDossierRaccordement = decodeParameter(reference);

      const { période } = await getPériodeAppelOffres(identifiantProjet);

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

      const props = mapToProps({
        role: utilisateur.rôle,
        période,
        gestionnaireRéseau,
        identifiantProjet,
        dossierRaccordement,
      });

      return (
        <ModifierDemandeComplèteRaccordementPage
          identifiantProjet={identifiantProjet.formatter()}
          raccordement={props.raccordement}
          gestionnaireRéseauActuel={props.gestionnaireRéseauActuel}
          delaiDemandeDeRaccordementEnMois={props.delaiDemandeDeRaccordementEnMois}
        />
      );
    }),
  );
}

type MapToProps = (args: {
  période: AppelOffre.Periode;
  role: Role.ValueType;
  gestionnaireRéseau: Lauréat.Raccordement.ConsulterGestionnaireRéseauRaccordementReadModel;
  dossierRaccordement: Lauréat.Raccordement.ConsulterDossierRaccordementReadModel;
  identifiantProjet: IdentifiantProjet.ValueType;
}) => ModifierDemandeComplèteRaccordementPageProps;

const mapToProps: MapToProps = ({
  role,
  période,
  gestionnaireRéseau: {
    aideSaisieRéférenceDossierRaccordement: { expressionReguliere, format, légende },
    identifiantGestionnaireRéseau,
    raisonSociale,
  },
  dossierRaccordement,
  identifiantProjet,
}) => {
  const canEdit =
    role.estDGEC() ||
    ((role.estPorteur() || role.estDreal()) && !dossierRaccordement.miseEnService);

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
    delaiDemandeDeRaccordementEnMois: période.delaiDcrEnMois,
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
