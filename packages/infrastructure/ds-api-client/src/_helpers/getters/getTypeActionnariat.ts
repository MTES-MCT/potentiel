import { Candidature } from '@potentiel-domain/projet';

import { DossierAccessor } from '../../graphql/index.js';

type GetNatureDeLExploitationProps<TDossier extends Record<string, string>> = {
  accessor: DossierAccessor<TDossier>;
  nomChampFinancementCollectif: keyof TDossier;
  nomChampGouvernancePartagée: keyof TDossier;
};

export const getTypeActionnariat = <TDossier extends Record<string, string>>({
  accessor,
  nomChampFinancementCollectif,
  nomChampGouvernancePartagée,
}: GetNatureDeLExploitationProps<TDossier>) => {
  const estFinancementCollectif = accessor.getBooleanValue(nomChampFinancementCollectif);
  const estGouvernancePartagée = accessor.getBooleanValue(nomChampGouvernancePartagée);

  if (estFinancementCollectif && estGouvernancePartagée)
    return Candidature.TypeActionnariat.financementCollectifEtGouvernancePartagée.type;
  if (estFinancementCollectif) return Candidature.TypeActionnariat.financementCollectif.type;
  if (estGouvernancePartagée) return Candidature.TypeActionnariat.gouvernancePartagée.type;
  return undefined;
};
