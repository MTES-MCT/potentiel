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
    àAjouter: getGRDsÀAjouter(gestionnairesORE, gestionnairesPotentiel),
    àModifier: getGRDsÀModifier(gestionnairesORE, gestionnairesPotentiel),
  };
};

const getGRDsÀAjouter = (
  gestionnairesORE: ReadonlyArray<OreGestionnaire>,
  gestionnairesPotentiel: GestionnaireRéseau.ListerGestionnaireRéseauReadModel,
) => {
  return gestionnairesORE.filter(
    ({ eic }) =>
      !gestionnairesPotentiel.items.some(
        ({ identifiantGestionnaireRéseau: { codeEIC } }) => codeEIC === eic,
      ),
  );
};

const getGRDsÀModifier = (
  gestionnairesORE: ReadonlyArray<OreGestionnaire>,
  gestionnairesPotentiel: GestionnaireRéseau.ListerGestionnaireRéseauReadModel,
) => {
  return getGRDsWithDiff(gestionnairesORE, gestionnairesPotentiel).map((potentielGestionnaire) => {
    const {
      identifiantGestionnaireRéseau: { codeEIC },
    } = potentielGestionnaire;

    const oreGestionnaire = gestionnairesORE.find(({ eic }) => codeEIC === eic);

    return {
      oreGestionnaire,
      potentielGestionnaire,
    };
  });
};

const getGRDsWithDiff = (
  gestionnairesORE: ReadonlyArray<OreGestionnaire>,
  gestionnairesPotentiel: GestionnaireRéseau.ListerGestionnaireRéseauReadModel,
) => {
  return gestionnairesPotentiel.items.filter(
    ({ identifiantGestionnaireRéseau: { codeEIC }, contactEmail, raisonSociale }) =>
      gestionnairesORE.some(({ eic, contact, grd }) => {
        const sameIdentifiant = codeEIC === eic;
        const sameRaisonSociale = raisonSociale === grd;
        const sameContactEmail = Option.match(contactEmail)
          .some((value) => value.formatter() === contact)
          .none(() => !contact);

        return sameIdentifiant && (!sameContactEmail || !sameRaisonSociale);
      }),
  );
};
