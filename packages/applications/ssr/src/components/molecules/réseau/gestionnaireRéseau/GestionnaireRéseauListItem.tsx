import { FC } from 'react';
import { encodeParameter } from '@/utils/encodeParameter';

type GestionnaireRéseauListItemProps = {
  identifiantGestionnaireRéseau: string;
  raisonSociale: string;
};

export const GestionnaireRéseauListItem: FC<GestionnaireRéseauListItemProps> = ({
  identifiantGestionnaireRéseau,
  raisonSociale,
}) => (
  <>
    <div>
      <div className="flex flex-col gap-1">
        <h2 className="leading-4">
          <span className="font-bold">{raisonSociale}</span>
        </h2>
      </div>
    </div>

    <div className="flex flex-col justify-between mt-4 md:mt-2">
      <a
        href={`/reseau/gestionnaires/${encodeParameter(identifiantGestionnaireRéseau)}`}
        className="self-end mt-2"
        aria-label={`voir le détails du gestionnaire de réseau ${raisonSociale}`}
      >
        voir
      </a>
    </div>
  </>
);
