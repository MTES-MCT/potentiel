import { encodeParameter } from '../encodeParameter';

export const details = (identifiantProjet: string, params: { success?: string } = {}) => {
  const url = `/projet/${encodeParameter(identifiantProjet)}/details.html`;
  if (Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams(params);
    return `${url}?${searchParams}`;
  }
  return url;
};
