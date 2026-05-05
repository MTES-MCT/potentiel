import { Candidature, Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { Heading6 } from '@/components/atoms/headings';
import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import { ChampObligatoireAvecAction } from '@/app/laureats/[identifiant]/_helpers';
import { Link } from '@/components/atoms/LinkNoPrefetch';

export type CandidatDétailsProps = {
  localité: ChampObligatoireAvecAction<PlainType<Lauréat.ConsulterLauréatReadModel['localité']>>;
  emailContact: string;
  coordonnées?: PlainType<Lauréat.ConsulterLauréatReadModel['coordonnées']>;
};

export const CandidatDétails = ({ localité, emailContact, coordonnées }: CandidatDétailsProps) => (
  <>
    <div className="flex flex-col gap-1">
      <Heading6>Site de Production</Heading6>
      <span>{localité.value.adresse1}</span>
      {localité.value.adresse2 && <span>{localité.value.adresse2}</span>}
      <span>
        {localité.value.codePostal} {localité.value.commune}
      </span>
      <span>
        {localité.value.département} {localité.value.région}
      </span>
      {coordonnées ? (
        <span title="Coordonnées géodésiques">
          {Candidature.Coordonnées.bind(coordonnées).formatter()}
          <Link
            href={`https://www.openstreetmap.org/?mlat=${coordonnées.latitude}&mlon=${coordonnées.longitude}`}
            aria-label="Ouvrir la carte"
            title="Ouvrir la carte"
            target="_blank"
            className="no-underline bg-none ml-2"
            rel="noopener noreferrer"
          />
        </span>
      ) : (
        <span className="italic">Coordonnées géodésiques non renseignées</span>
      )}
      {localité.action && (
        <TertiaryLink href={localité.action.url}>{localité.action.label}</TertiaryLink>
      )}
    </div>

    <div className="flex flex-col gap-1">
      <Heading6>Adresse email de candidature</Heading6>
      <span>{emailContact}</span>
    </div>
  </>
);
