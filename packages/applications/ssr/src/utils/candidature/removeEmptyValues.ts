const valuesToStrip = ['', 'N/A', '#N/A', '0'];

export const removeEmptyValues = (obj: Record<string, string>) =>
  Object.fromEntries(Object.entries(obj).filter(([, value]) => !valuesToStrip.includes(value)));
