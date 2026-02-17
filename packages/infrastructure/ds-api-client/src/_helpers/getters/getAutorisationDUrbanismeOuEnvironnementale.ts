import { DossierAccessor } from '../../graphql/index.js';

type GetAutorisationDUrbanismeOuEnvironnementaleProps<TDossier extends Record<string, string>> = {
  accessor: DossierAccessor<TDossier>;
  nomChampDate: keyof TDossier;
  nomChampNuméro: keyof TDossier;
};
export const getAutorisationDUrbanismeOuEnvironnementale = <
  TDossier extends Record<string, string>,
>({
  accessor,
  nomChampDate,
  nomChampNuméro,
}: GetAutorisationDUrbanismeOuEnvironnementaleProps<TDossier>) => {
  const numéro = accessor.getStringValue(nomChampNuméro);
  const date = accessor.getDateValue(nomChampDate);

  if (numéro && date) {
    return {
      numéro,
      date,
    };
  }
};
