import { DossierAccessor } from '../../graphql/index.js';

type GetAutorisationProps<TDossier extends Record<string, string>> = {
  accessor: DossierAccessor<TDossier>;
  nomChampDate: keyof TDossier;
  nomChampNuméro: keyof TDossier;
};
export const getAutorisation = <TDossier extends Record<string, string>>({
  accessor,
  nomChampDate,
  nomChampNuméro,
}: GetAutorisationProps<TDossier>) => {
  const numéro = accessor.getStringValue(nomChampNuméro);
  const date = accessor.getDateValue(nomChampDate);

  if (numéro && date) {
    return {
      numéro,
      date,
    };
  }
};
