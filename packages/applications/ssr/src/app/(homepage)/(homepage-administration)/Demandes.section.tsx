import Contract from '@codegouvfr/react-dsfr/picto/Contract';

import {
  getNombreDemandesÀInstruire,
  type NombreDemandesÀInstruire,
} from '@/app/_helpers/getNombreDemandesÀInstruire';
import { Section } from '@/components/atoms/section/Section';
import { SectionWithErrorHandling } from '@/components/atoms/section/SectionWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { DemandesDétails } from './Demandes.détails';

const sectionTitle = 'Demandes à instruire';

export const DemandesSection = () =>
  SectionWithErrorHandling(
    withUtilisateur(async (utilisateur) => {
      const autorité = utilisateur.estDreal() ? 'dreal' : 'dgec';

      const nombreDemandesÀInstruire = await getNombreDemandesÀInstruire(
        utilisateur.identifiantUtilisateur.email,
        autorité,
      );

      const demandes = mapDemandesToDemandesDétails(nombreDemandesÀInstruire);

      return (
        <Section
          title={sectionTitle}
          picto={<Contract color="yellow-moutarde" fontSize="large" />}
          className="border-none"
          filters={{ userFilters: utilisateur.filtres }}
        >
          <DemandesDétails demandes={demandes} autorité={autorité} />
        </Section>
      );
    }),
    sectionTitle,
  );

const mapDemandesToDemandesDétails = (demandes: Array<NombreDemandesÀInstruire>) =>
  demandes.sort((a, b) => a.domain.localeCompare(b.domain));
