import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { getAction } from '@/app/laureats/[identifiant]/_helpers/getAction';

import { Section } from '../../../(components)/Section';
import { getLauréatInfos } from '../../../../_helpers/getLauréat';

import { CandidatDétails } from './CandidatDétails';

type CandidatSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const CandidatSection = ({ identifiantProjet }: CandidatSectionProps) =>
  withUtilisateur(async ({ rôle }) => {
    const lauréat = await getLauréatInfos(identifiantProjet);

    const action = await getAction({
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      domain: 'siteDeProduction',
      rôle,
    });

    const localité = {
      value: mapToPlainObject(lauréat.localité),
      action,
    };

    return (
      <Section title="Candidat">
        <CandidatDétails localité={localité} emailContact={lauréat.emailContact.email} />
      </Section>
    );
  });
