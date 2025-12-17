import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { withUtilisateur } from '@/utils/withUtilisateur';

import { getAction, getFournisseurInfos } from '../../_helpers';
import { Section } from '../(components)/Section';

import { FournisseursDétails } from './FournisseursDétails';

export type FournisseursSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const FournisseursSection = async ({ identifiantProjet }: FournisseursSectionProps) =>
  withUtilisateur(async ({ rôle }) => {
    const { fournisseurs } = await getFournisseurInfos(identifiantProjet);

    const action = await getAction({
      identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
      rôle,
      domain: 'fournisseur',
    });

    return (
      <Section title="Fournisseurs">
        <FournisseursDétails fournisseurs={{ value: mapToPlainObject(fournisseurs), action }} />
      </Section>
    );
  });
