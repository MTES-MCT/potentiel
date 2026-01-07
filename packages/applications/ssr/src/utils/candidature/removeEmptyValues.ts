const valuesToStrip = ['', 'N/A', '#N/A', '0'];

export const removeEmptyValues = (obj: Record<string, string | undefined>) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([key, value]) => !!key && value !== undefined && !valuesToStrip.includes(value),
    ),
  );
