import { fr } from '@codegouvfr/react-dsfr';
import Tile from '@codegouvfr/react-dsfr/Tile';
import clsx from 'clsx';

export type DemandeTileProps = {
  titre: string;
  ariaLabel: string;
  href: string;
  total: number;
  new: number;
};

export const DemandeTile = ({ titre, ariaLabel, href, total, new: newCount }: DemandeTileProps) => {
  const récents =
    newCount === 1 ? 'dont une demande récente' : `dont ${newCount} demandes récentes`;

  return (
    <Tile
      className="w-72"
      enlargeLinkOrButton
      linkProps={{
        href,
        'aria-label': `${ariaLabel}${newCount > 0 ? ` (${récents})` : ''}`,
      }}
      orientation="horizontal"
      title={titre}
      desc={
        total ? (
          <>
            <span className="font-semibold">
              {total} {total > 1 ? 'demandes' : 'demande'} à instruire
            </span>
            {newCount > 0 && (
              <>
                <br />
                <span className={clsx(fr.cx('fr-text--sm', 'fr-notice--info'), 'px-1')}>
                  {récents}
                </span>
              </>
            )}
          </>
        ) : (
          'Aucune demande à instruire'
        )
      }
      titleAs="h3"
    />
  );
};
