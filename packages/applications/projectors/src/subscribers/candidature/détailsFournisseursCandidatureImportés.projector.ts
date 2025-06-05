import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { updateOneProjection } from '@potentiel-infrastructure/pg-projection-write';

export const détailsFournisseursCandidatureImportésProjector = async ({
  payload,
}: Candidature.DétailsFournisseursCandidatureImportésEvent) => {
  const fournisseurs = payload.fournisseurs.map((fournisseur) => ({
    typeFournisseur: Lauréat.Fournisseur.TypeFournisseur.convertirEnValueType(
      fournisseur.typeFournisseur,
    ).typeFournisseur,
    nomDuFabricant: fournisseur.nomDuFabricant,
  }));

  await updateOneProjection<Candidature.CandidatureEntity>(
    `candidature|${payload.identifiantProjet}`,
    { fournisseurs },
  );
};
