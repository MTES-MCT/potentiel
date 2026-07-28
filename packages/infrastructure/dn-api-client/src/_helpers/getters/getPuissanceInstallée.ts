import type { DossierAccessor } from '../../graphql/index.js';

type GetNatureDeLExploitationProps<TDossier extends Record<string, string>> = {
  accessor: DossierAccessor<TDossier>;
  nomChampPuissanceInstallée: keyof TDossier;
  nomChampPuissanceInstalléeP: keyof TDossier;
};

export const getPuissanceInstallée = <TDossier extends Record<string, string>>({
  accessor,
  nomChampPuissanceInstallée,
  nomChampPuissanceInstalléeP,
}: GetNatureDeLExploitationProps<TDossier>) => {
  const puissanceInstallée = accessor.getNumberValue(nomChampPuissanceInstallée);
  const puissanceInstalléeP = accessor.getNumberValue(nomChampPuissanceInstalléeP);

  return puissanceInstalléeP ?? puissanceInstallée;
};
