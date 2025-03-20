import { fr } from '@codegouvfr/react-dsfr';

type LoginMethodTileProps = {
  title: string;
  description: string;
  className?: string;
  détail: React.ReactNode;
};

/**
 * @description Ce composant a été volontairement créer car auj le composant <Tile> du dsfr (https://components.react-dsfr.codegouv.studio/?path=/docs/components-tile--default)
 * englobe le params `detail` dans un <p>, ce qui nous empêche la flexibilité de pouvoir mettre d'autres tag html (comme un autre paragrage, un formulaire, etc)
 */
export const LoginMethodTile = ({
  title,
  description,
  détail,
  className,
}: LoginMethodTileProps) => (
  <div
    className={`${fr.cx('fr-tile')} flex flex-col justify-between gap-4 lg:w-2/3 text-center py-6 ${className}`}
  >
    <div className={`${fr.cx('fr-tile__body')}`}>
      <div className={`${fr.cx('fr-tile__content')}`}>
        <div className="flex flex-col items-center gap-2">
          <div className={`${fr.cx('fr-tile__title')}`}>{title}</div>
          <p className={`${fr.cx('fr-tile__desc')} max-w-lg xl:max-w-2xl text-center"`}>
            {description}
          </p>
        </div>
        <div className={`${fr.cx('fr-tile__detail')}`}>{détail}</div>
      </div>
    </div>
  </div>
);
