import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { withUtilisateur } from '@/utils/withUtilisateur';

import { getAction, getFournisseurInfos, SectionWithErrorHandling } from '../../_helpers';
import { Section } from '../(components)/Section';

import { FournisseursDétails } from './FournisseursDétails';

export type FournisseursSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Fournisseurs';
export const FournisseursSection = async ({ identifiantProjet }: FournisseursSectionProps) =>
  SectionWithErrorHandling(
    () =>
      withUtilisateur(async ({ rôle }) => {
        const { fournisseurs } = await getFournisseurInfos(identifiantProjet);

        const action = await getAction({
          identifiantProjet: IdentifiantProjet.convertirEnValueType(identifiantProjet),
          rôle,
          domain: 'fournisseur',
        });

        return (
          <Section title={sectionTitle}>
            <FournisseursDétails fournisseurs={{ value: mapToPlainObject(fournisseurs), action }} />
          </Section>
        );
      }),
    sectionTitle,
  );
