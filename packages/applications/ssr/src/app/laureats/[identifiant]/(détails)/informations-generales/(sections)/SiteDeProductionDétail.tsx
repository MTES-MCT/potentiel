import type { PlainType } from '@potentiel-domain/core';
import { Candidature, type Lauréat } from '@potentiel-domain/projet';

import type { ChampObligatoireAvecAction } from '@/app/laureats/[identifiant]/_helpers';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import { OpenStreetMapPreview } from '../../_helpers/OpenStreetMapPreview';

export type SiteDeProductionDétailsProps = {
  localité: ChampObligatoireAvecAction<PlainType<Lauréat.ConsulterLauréatReadModel['localité']>>;
  coordonnées?: PlainType<Lauréat.ConsulterLauréatReadModel['coordonnées']>;
};

export const SiteDeProductionDétails = ({
  localité,
  coordonnées,
}: SiteDeProductionDétailsProps) => (
  <div className="flex flex-col gap-2">
    <div className="flex flex-col gap-1">
      <span>{localité.value.adresse1}</span>
      {localité.value.adresse2 && <span>{localité.value.adresse2}</span>}
      <span>
        {localité.value.codePostal} {localité.value.commune}
      </span>
      <span>
        {localité.value.département} {localité.value.région}
      </span>
    </div>
    {coordonnées ? (
      <div>
        Coordonnées : {Candidature.Coordonnées.bind(coordonnées).formatter()}
        <OpenStreetMapPreview latitude={coordonnées.latitude} longitude={coordonnées.longitude} />
        <TertiaryLink
          href={`https://www.openstreetmap.org/?mlat=${coordonnées.latitude}&mlon=${coordonnées.longitude}`}
          aria-label="Ouvrir la carte OpenStreetMap dans un nouvel onglet"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ouvrir dans OpenStreetMap
        </TertiaryLink>
      </div>
    ) : (
      <span className="italic">Coordonnées géodésiques non renseignées</span>
    )}
    {localité.action && (
      <TertiaryLink href={localité.action.url}>{localité.action.label}</TertiaryLink>
    )}
  </div>
);
