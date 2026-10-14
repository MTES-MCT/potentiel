import Contract from '@codegouvfr/react-dsfr/picto/Contract';

import {
  type DemandesEnInstruction,
  getNombreDemandesEnInstruction,
} from '@/app/_helpers/getNombreDemandesEnInstruction';
import { Section } from '@/components/atoms/section/Section';
import { SectionWithErrorHandling } from '@/components/atoms/section/SectionWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { DemandesDétails } from './Demandes.détails';

const sectionTitle = 'Demandes à traiter';

export const DemandesSection = () =>
  SectionWithErrorHandling(
    withUtilisateur(async (utilisateur) => {
      const autorité = utilisateur.estDreal() ? 'dreal' : 'dgec';
      const nombreDemandesEnInstruction = await getNombreDemandesEnInstruction({
        utilisateur: utilisateur.identifiantUtilisateur.email,
        rôle: autorité,
      });

      const { avecNouvellesDemandes, sansNouvellesDemandes } = await mapDemandesToDemandesDétails(
        nombreDemandesEnInstruction,
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

const mapDemandesToDemandesDétails = async (demandes: Array<DemandesEnInstruction>) => {
  return {
    avecNouvellesDemandes: demandes.filter((demande) => demande.new > 0),
    sansNouvellesDemandes: demandes.filter((demande) => demande.new === 0),
  };
};
