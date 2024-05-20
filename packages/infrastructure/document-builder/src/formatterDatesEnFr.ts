type FormatterDatesEnFr<TData> = {
  data: TData;
  keys: ReadonlyArray<keyof TData>;
};
export const formatterDatesEnFr = <TData extends Record<string, string>>({
  data,
  keys,
}: FormatterDatesEnFr<TData>) => {
  if (keys.length === 0) {
    return data;
  }

  const formattedData = { ...data };

  keys.forEach((key) => {
    const estUneDateValide = !isNaN(new Date(data[key]).getTime());

    if (typeof data[key] === 'string' && estUneDateValide) {
      formattedData[key] = new Date(data[key]).toLocaleDateString('fr-FR') as TData[keyof TData];
    }
  });

  return formattedData;
};
