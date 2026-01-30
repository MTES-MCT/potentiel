type GetFiltresActifsProps = Record<string, string | string[] | undefined>;

export const getFiltresActifs = (filtres: GetFiltresActifsProps) =>
  Object.fromEntries(
    Object.entries(filtres)
      .filter(([_, value]) =>
        value === undefined || (Array.isArray(value) && value.length === 0) ? false : true,
      )
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return [key, value];
        }

        return [key, value as string];
      }),
  );
