import { Lauréat } from '@potentiel-domain/projet';
import { PlainType } from '@potentiel-domain/core';

import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';

import { ChampObligatoireAvecAction } from '../../../../_helpers/types';
import { Heading6 } from '../../../../../../../components/atoms/headings';

export type CandidatDétailsProps = {
  localité: ChampObligatoireAvecAction<PlainType<Lauréat.ConsulterLauréatReadModel['localité']>>;
  emailContact: string;
};

export const CandidatDétails = ({ localité, emailContact }: CandidatDétailsProps) => (
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
