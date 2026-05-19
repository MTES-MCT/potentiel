import { mediator } from "mediateur";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { Routes } from "@potentiel-applications/routes";
import type { AppelOffre } from "@potentiel-domain/appel-offre";
import { mapToPlainObject } from "@potentiel-domain/core";
import { IdentifiantProjet, type Lauréat } from "@potentiel-domain/projet";
import type { GestionnaireRéseau } from "@potentiel-domain/reseau";
import type { Role } from "@potentiel-domain/utilisateur";
import { Option } from "@potentiel-libraries/monads";

import { getPériodeAppelOffres } from "@/app/_helpers";
import { getLauréat } from "@/app/laureats/[identifiant]/_helpers";
import { decodeParameter } from "@/utils/decodeParameter";
import { PageWithErrorHandling } from "@/utils/PageWithErrorHandling";
import { withUtilisateur } from "@/utils/withUtilisateur";
import { vérifierSiModificationRaccordementPossible } from "../../../../(raccordement-du-projet)/(détails)/_helpers";
import {
  ModifierDemandeComplèteRaccordementPage,
  type ModifierDemandeComplèteRaccordementPageProps,
} from "./ModifierDemandeComplèteRaccordement.page";

export const metadata: Metadata = {
  title: "Modifier un dossier de raccordement",
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
        "Lauréat.Raccordement.UseCase.ModifierDemandeComplèteRaccordement",
      );
      utilisateur.rôle.peutExécuterMessage<Lauréat.Raccordement.ModifierRéférenceDossierRaccordementUseCase>(
        "Lauréat.Raccordement.UseCase.ModifierRéférenceDossierRaccordement",
      );

      const identifiantProjet = IdentifiantProjet.convertirEnValueType(
        decodeParameter(identifiant),
      );

      const lauréat = await getLauréat(identifiantProjet.formatter());
      const peutModifierRaccordement =
        vérifierSiModificationRaccordementPossible(lauréat);
      if (!peutModifierRaccordement) {
        return redirect(
          Routes.Lauréat.détails.tableauDeBord(identifiantProjet.formatter()),
        );
      }

      const referenceDossierRaccordement = decodeParameter(reference);

      const { période } = await getPériodeAppelOffres(
        identifiantProjet.formatter(),
      );

      const gestionnaireRéseau =
        await mediator.send<Lauréat.Raccordement.ConsulterGestionnaireRéseauRaccordementQuery>(
          {
            type: "Lauréat.Raccordement.Query.ConsulterGestionnaireRéseauRaccordement",
            data: { identifiantProjetValue: identifiantProjet.formatter() },
          },
        );

      const listeGestionnairesRéseau = Option.isSome(gestionnaireRéseau)
        ? undefined
        : await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>(
            {
              type: "Réseau.Gestionnaire.Query.ListerGestionnaireRéseau",
              data: {},
            },
          );

      const dossierRaccordement =
        await mediator.send<Lauréat.Raccordement.ConsulterDossierRaccordementQuery>(
          {
            type: "Lauréat.Raccordement.Query.ConsulterDossierRaccordement",
            data: {
              référenceDossierRaccordementValue: referenceDossierRaccordement,
              identifiantProjetValue: identifiantProjet.formatter(),
            },
          },
        );

      if (Option.isNone(dossierRaccordement)) {
        return notFound();
      }

      const props = mapToProps({
        role: utilisateur.rôle,
        période,
        gestionnaireRéseau: Option.isSome(gestionnaireRéseau)
          ? gestionnaireRéseau
          : undefined,
        identifiantProjet,
        dossierRaccordement,
        listeGestionnairesRéseau: listeGestionnairesRéseau,
      });

      return (
        <ModifierDemandeComplèteRaccordementPage
          identifiantProjet={identifiantProjet.formatter()}
          raccordement={props.raccordement}
          gestionnaireRéseauActuel={props.gestionnaireRéseauActuel}
          delaiDemandeDeRaccordementEnMois={
            props.delaiDemandeDeRaccordementEnMois
          }
          listeGestionnairesRéseau={props.listeGestionnairesRéseau}
        />
      );
    }),
  );
}

type MapToProps = (args: {
  période: AppelOffre.Periode;
  role: Role.ValueType;
  gestionnaireRéseau?: Lauréat.Raccordement.ConsulterGestionnaireRéseauRaccordementReadModel;
  dossierRaccordement: Lauréat.Raccordement.ConsulterDossierRaccordementReadModel;
  identifiantProjet: IdentifiantProjet.ValueType;
  listeGestionnairesRéseau:
    | GestionnaireRéseau.ListerGestionnaireRéseauReadModel
    | undefined;
}) => ModifierDemandeComplèteRaccordementPageProps;

const mapToProps: MapToProps = ({
  role,
  période,
  gestionnaireRéseau,
  dossierRaccordement,
  identifiantProjet,
  listeGestionnairesRéseau: gestionnairesRéseau,
}) => {
  const canEdit =
    role.estDGEC() ||
    ((role.estPorteur() || role.estDreal()) &&
      !dossierRaccordement.miseEnService);

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
    gestionnaireRéseauActuel: gestionnaireRéseau && {
      identifiantGestionnaireRéseau:
        gestionnaireRéseau.identifiantGestionnaireRéseau.formatter(),
      raisonSociale: gestionnaireRéseau.raisonSociale,
      aideSaisieRéférenceDossierRaccordement: {
        expressionReguliere:
          gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement.expressionReguliere.formatter(),
        format:
          gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement.format ||
          "",
        légende:
          gestionnaireRéseau.aideSaisieRéférenceDossierRaccordement.légende ||
          "",
      },
    },
    listeGestionnairesRéseau:
      gestionnairesRéseau && mapToPlainObject(gestionnairesRéseau.items),
  };
};
