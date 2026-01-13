import { notFound } from 'next/navigation';

import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { Section } from '@/components/atoms/menu/Section';
import { SectionWithErrorHandling } from '@/components/atoms/menu/SectionWithErrorHandling';

import { getÉliminé } from '../../../../_helpers/getÉliminé';

import { DonnéesCandidatureDétail } from './DonnéesCandidatureDétails';

type DonnéesCandidatureSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Données de la candidature';

export const DonnéesCandidatureSection = ({
  identifiantProjet: identifiantProjetValue,
}: DonnéesCandidatureSectionProps) =>
  SectionWithErrorHandling(
    withUtilisateur(async () => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
      const éliminé = await getÉliminé(identifiantProjet.formatter());

      if (!éliminé) {
        return notFound();
      }

      return (
        <Section title={sectionTitle} className="min-w-0">
          <DonnéesCandidatureDétail éliminé={mapToPlainObject(éliminé)} />
        </Section>
      );
    }),
    sectionTitle,
  );
