import { fr } from '@codegouvfr/react-dsfr';
import Tile from '@codegouvfr/react-dsfr/Tile';
import clsx from 'clsx';

export type DemandeTileProps = {
  titre: string;
  ariaLabel: string;
  href: string;
  total: number;
  new: number;
  nEstPasÀInstruire?: true;
};

export const DemandeTile = ({
  titre,
  ariaLabel,
  href,
  total,
  new: newCount,
  nEstPasÀInstruire,
}: DemandeTileProps) => {
  const récents =
    newCount === 1 ? 'dont une demande récente' : `dont ${newCount} demandes récentes`;
  const commonDesc = total ? (
    <>
      <span className="font-semibold">
        {total} {total > 1 ? 'demandes' : 'demande'} à instruire
      </span>
      {newCount > 0 && (
        <>
          <br />
          <span className={clsx(fr.cx('fr-text--sm', 'fr-notice--info'), 'px-1')}>{récents}</span>
        </>
      )}
    </>
  ) : (
    'Aucune demande à instruire'
  );

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
        nEstPasÀInstruire ? (
          <span className="font-semibold">
            {total ? total : 'Aucun'} {total > 1 ? 'projets' : 'projet'}
          </span>
        ) : (
          commonDesc
        )
      }
      titleAs="h3"
    />
  );
};
