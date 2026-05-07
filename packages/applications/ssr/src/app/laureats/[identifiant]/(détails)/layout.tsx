import { IdentifiantProjet } from '@potentiel-domain/projet';

import { decodeParameter } from '@/utils/decodeParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { Menu } from '@/components/atoms/menu/Menu';

import { getLauréatMenuItems } from './_helpers/getLauréatMenuItems';

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ identifiant: string }>;
};

export default async function LauréatDétailsLayout(props: LayoutProps) {
  const params = await props.params;

  const { children } = props;

  return withUtilisateur(async (utilisateur) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(
      decodeParameter(params.identifiant),
    );

    const items = await getLauréatMenuItems({ identifiantProjet, utilisateur });

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
