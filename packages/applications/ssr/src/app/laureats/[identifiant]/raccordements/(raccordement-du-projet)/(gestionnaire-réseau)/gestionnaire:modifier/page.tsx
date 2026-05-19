import { mediator } from "mediateur";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Routes } from "@potentiel-applications/routes";
import { mapToPlainObject } from "@potentiel-domain/core";
import { IdentifiantProjet, type Lauréat } from "@potentiel-domain/projet";
import type { GestionnaireRéseau } from "@potentiel-domain/reseau";

import { decodeParameter } from "@/utils/decodeParameter";
import type { IdentifiantParameter } from "@/utils/identifiantParameter";
import { PageWithErrorHandling } from "@/utils/PageWithErrorHandling";
import { withUtilisateur } from "@/utils/withUtilisateur";
import { getLauréat } from "../../../../_helpers";
import { vérifierSiModificationRaccordementPossible } from "../../(détails)/_helpers";
import { ModifierGestionnaireRéseauRaccordementPage } from "./ModifierGestionnaireRéseauRaccordement.page";

export const metadata: Metadata = { title: "Modifier le gestionnaire réseau" };

export default async function Page(props: IdentifiantParameter) {
  const params = await props.params;

  const { identifiant } = params;

  return PageWithErrorHandling(async () =>
    withUtilisateur(async (utilisateur) => {
      utilisateur.rôle.peutExécuterMessage<Lauréat.Raccordement.ModifierGestionnaireRéseauRaccordementUseCase>(
        "Lauréat.Raccordement.UseCase.ModifierGestionnaireRéseauRaccordement",
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

      const gestionnairesRéseau =
        await mediator.send<GestionnaireRéseau.ListerGestionnaireRéseauQuery>({
          type: "Réseau.Gestionnaire.Query.ListerGestionnaireRéseau",
          data: {},
        });

      const gestionnaireRéseau =
        await mediator.send<Lauréat.Raccordement.ConsulterGestionnaireRéseauRaccordementQuery>(
          {
            type: "Lauréat.Raccordement.Query.ConsulterGestionnaireRéseauRaccordement",
            data: { identifiantProjetValue: identifiantProjet.formatter() },
          },
        );

      return (
        <ModifierGestionnaireRéseauRaccordementPage
          gestionnaireRéseauActuel={mapToPlainObject(gestionnaireRéseau)}
          listeGestionnairesRéseau={mapToPlainObject(gestionnairesRéseau.items)}
          identifiantProjet={mapToPlainObject(identifiantProjet)}
        />
      );
    }),
  );
}
