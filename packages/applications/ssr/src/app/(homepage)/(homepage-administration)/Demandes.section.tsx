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

      const { avecNouvellesDemandes, sansNouvellesDemandes } = await mapDemandesToDemandesDétails(
        nombreDemandesÀInstruire,
        autorité,
      );

      return (
        <Section
          title={sectionTitle}
          picto={<Contract color="yellow-moutarde" fontSize="large" />}
          className="border-none"
        >
          <DemandesDétails
            avecNouvellesDemandes={avecNouvellesDemandes}
            sansNouvellesDemandes={sansNouvellesDemandes}
            autorité={autorité}
          />
        </Section>
      );
    }),
    sectionTitle,
  );

const mapDemandesToDemandesDétails = async (
  demandes: Array<NombreDemandesÀInstruire>,
  autorité: 'dgec' | 'dreal',
) => {
  // dirty fix, à améliorer
  const filteredDemandes =
    autorité === 'dreal' ? demandes.filter((demande) => demande.domain !== 'recours') : demandes;

  return {
    avecNouvellesDemandes: filteredDemandes.filter((demande) => demande.new > 0),
    sansNouvellesDemandes: filteredDemandes.filter((demande) => demande.new === 0),
  };
};
