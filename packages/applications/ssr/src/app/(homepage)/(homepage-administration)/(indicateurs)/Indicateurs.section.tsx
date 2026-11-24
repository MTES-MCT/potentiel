import DataVisualization from '@codegouvfr/react-dsfr/picto/DataVisualization';

import { Section } from '@/components/atoms/section/Section';
import { SectionWithErrorHandling } from '@/components/atoms/section/SectionWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getNombreDeGarantiesFinancièresÀInstruire } from '../_helpers/getNombreDeGarantiesFinancièresÀInstruire';
import { IndicateursDétails } from './Indicateurs.détails';

const sectionTitle = 'Indicateurs';

export const IndicateursSection = () =>
  SectionWithErrorHandling(
    withUtilisateur(async (utilisateur) => {
      const garantiesFinancières = await getNombreDeGarantiesFinancièresÀInstruire(
        utilisateur.identifiantUtilisateur.email,
      );

      return (
        <Section
          title={sectionTitle}
          picto={<DataVisualization color="blue-ecume" fontSize="large" />}
          className="border-none"
        >
          <IndicateursDétails garantiesFinancières={garantiesFinancières} />
        </Section>
      );
    }),
    sectionTitle,
  );
