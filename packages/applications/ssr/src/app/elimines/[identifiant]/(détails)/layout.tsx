import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { Menu } from '@/components/atoms/menu/Menu';

import { getÉliminéMenuItems } from './_helpers/getÉliminéMenuItems';

type LayoutProps = {
  children: React.ReactNode;
  params: { identifiant: string };
};

export default async function ÉliminéDétailsLayout({ children, params }: LayoutProps) {
  return withUtilisateur(async (utilisateur) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      decodeParameter(params.identifiant),
    );

    const items = await getÉliminéMenuItems({ identifiantProjet, utilisateur });

    return (
      <div className="flex flex-col gap-2">
        <div className="flex flex-col md:flex-row">
          <Menu items={items} />
          <div className="flex-1">{children}</div>
        </div>
      </div>
    );
  });
}
