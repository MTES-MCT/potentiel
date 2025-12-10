import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { getContext } from '@potentiel-applications/request-context';

import { decodeParameter } from '@/utils/decodeParameter';

import { getCahierDesCharges } from '../../../_helpers';

import { MenuLauréat } from './(components)/MenuLauréat';

type LayoutProps = {
  children: React.ReactNode;
  params: { identifiant: string };
};

export default async function LauréatDétailsLayout({ children, params }: LayoutProps) {
  const identifiantProjet = IdentifiantProjet.convertirEnValueType(
    decodeParameter(params.identifiant),
  );

  const baseURL = `/laureats/${encodeURIComponent(identifiantProjet.formatter())}`;

  const cahierDesCharges = await getCahierDesCharges(identifiantProjet);

  const { features } = getContext() ?? {};

  // Redirection vers la page projet legacy
  if (!features?.includes('page-projet')) {
    return children;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col md:flex-row">
        <MenuLauréat baseURL={baseURL} cahierDesCharges={mapToPlainObject(cahierDesCharges)} />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
