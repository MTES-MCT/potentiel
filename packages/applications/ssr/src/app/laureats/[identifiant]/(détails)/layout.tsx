import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { getContext } from '@potentiel-applications/request-context';

import { decodeParameter } from '@/utils/decodeParameter';

import { getCahierDesCharges } from '../../../_helpers';
import { withUtilisateur } from '../../../../utils/withUtilisateur';

import { MenuLauréat } from './(components)/MenuLauréat';
import { getTâches } from './taches/_helpers/getTâches';

type LayoutProps = {
  children: React.ReactNode;
  params: { identifiant: string };
};

export default async function LauréatDétailsLayout({ children, params }: LayoutProps) {
  return withUtilisateur(async (utilisateur) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      decodeParameter(params.identifiant),
    );

    const baseURL = `/laureats/${encodeURIComponent(identifiantProjet.formatter())}`;

    const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());
    const tâches = utilisateur.rôle.aLaPermission('tâche.consulter')
      ? await getTâches(identifiantProjet.formatter(), utilisateur.identifiantUtilisateur.email)
      : undefined;

    const { features } = getContext() ?? {};

    if (!features?.includes('page-projet')) {
      return children;
    }

    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-col md:flex-row">
          <MenuLauréat
            baseURL={baseURL}
            cahierDesCharges={mapToPlainObject(cahierDesCharges)}
            nombreTâches={tâches?.total}
          />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    );
  });
}
