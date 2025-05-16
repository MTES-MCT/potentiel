import { Raccordement } from '@potentiel-domain/projet';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { upsertProjection } from '@potentiel-infrastructure/pg-projection-write';

export type DossierRaccordement = Omit<Raccordement.DossierRaccordementEntity, 'type'>;

type UpsertDossierRaccordementProps = {
  identifiantProjet: IdentifiantProjet.RawType;
  raccordement: Omit<Raccordement.RaccordementEntity, 'type'>;
  dossierRaccordement: DossierRaccordement;
};

export const upsertDossierRaccordement = async ({
  identifiantProjet,
  raccordement,
  dossierRaccordement,
}: UpsertDossierRaccordementProps) => {
  await upsertProjection<Raccordement.RaccordementEntity>(`raccordement|${identifiantProjet}`, {
    ...raccordement,
    dossiers: raccordement.dossiers
      .filter((d) => d.référence !== dossierRaccordement.référence)
      .concat(dossierRaccordement),
  });
  await upsertProjection<Raccordement.DossierRaccordementEntity>(
    `dossier-raccordement|${identifiantProjet}#${dossierRaccordement.référence}`,
    dossierRaccordement,
  );
};
