import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { MenuLauréat } from './(components)/MenuLauréat';
import { getLauréatMenuItems } from './_helpers/getLauréatMenuItems';

type LayoutProps = {
  children: React.ReactNode;
  params: { identifiant: string };
};

export default async function LauréatDétailsLayout({ children, params }: LayoutProps) {
  return withUtilisateur(async (utilisateur) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      decodeParameter(params.identifiant),
    );

    const items = await getLauréatMenuItems({ identifiantProjet, utilisateur });

    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-col md:flex-row">
          <MenuLauréat items={items} />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    );
  });
}
