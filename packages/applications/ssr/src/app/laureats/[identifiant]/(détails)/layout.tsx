import { IdentifiantProjet } from '@potentiel-domain/projet';

import { Menu } from '@/components/atoms/menu/Menu';
import { decodeParameter } from '@/utils/decodeParameter';
import { IdentifiantParameter } from '@/utils/identifiantParameter';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { getLauréatMenuItems } from './_helpers/getLauréatMenuItems';

type LayoutProps = IdentifiantParameter & {
  children: React.ReactNode;
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
