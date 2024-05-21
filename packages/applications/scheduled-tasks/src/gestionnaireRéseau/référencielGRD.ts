import { GestionnaireRéseau } from '@potentiel-domain/reseau';
import { Option } from '@potentiel-libraries/monads';
import { OreGestionnaire } from '@potentiel-infrastructure/ore-client';

export type RéférencielGRD = {
  àAjouter: ReadonlyArray<OreGestionnaire>;
  àModifier: ReadonlyArray<{
    potentielGestionnaire: GestionnaireRéseau.ListerGestionnaireRéseauReadModel['items'][number];
    oreGestionnaire: OreGestionnaire | undefined;
  }>;
};

export const mapToRéférencielGRD = (
  gestionnairesORE: ReadonlyArray<OreGestionnaire>,
  gestionnairesPotentiel: GestionnaireRéseau.ListerGestionnaireRéseauReadModel,
): RéférencielGRD => {
  return {
    àAjouter: gestionnairesORE.filter(
      ({ eic }) =>
        !gestionnairesPotentiel.items.some(({ identifiantGestionnaireRéseau }) =>
          GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(eic).estÉgaleÀ(
            identifiantGestionnaireRéseau,
          ),
        ),
    ),
    àModifier: gestionnairesPotentiel.items
      .filter(({ identifiantGestionnaireRéseau, contactEmail, raisonSociale }) =>
        gestionnairesORE.some(({ eic, contact, grd }) => {
          const sameIdentifiant =
            GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(eic).estÉgaleÀ(
              identifiantGestionnaireRéseau,
            );
          const sameRaisonSocial = raisonSociale === grd;
          const sameContactEmail = Option.match(contactEmail)
            .some((value) => value.formatter() === contact)
            .none(() => !contact);

          return sameIdentifiant && (!sameContactEmail || !sameRaisonSocial);
        }),
      )
      .map((potentielGestionnaire) => {
        const oreGestionnaire = gestionnairesORE.find(({ eic }) =>
          GestionnaireRéseau.IdentifiantGestionnaireRéseau.convertirEnValueType(eic).estÉgaleÀ(
            potentielGestionnaire.identifiantGestionnaireRéseau,
          ),
        );

        return {
          oreGestionnaire,
          potentielGestionnaire,
        };
      }),
  };
};
