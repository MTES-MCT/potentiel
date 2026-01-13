import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { Section } from '@/components/atoms/menu/Section';
import { SectionWithErrorHandling } from '@/components/atoms/menu/SectionWithErrorHandling';

import { getAction, getFournisseurInfos } from '../../../_helpers';

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
