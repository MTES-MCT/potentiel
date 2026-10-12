import Contract from '@codegouvfr/react-dsfr/picto/Contract';

import type { PotentielUtilisateur } from '@potentiel-applications/request-context';

import { getNombreDemandesEnInstruction } from '@/app/_helpers/getNombreDemandesEnInstruction';
import { Section } from '@/components/atoms/section/Section';
import { SectionWithErrorHandling } from '@/components/atoms/section/SectionWithErrorHandling';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { DemandesDétails } from './Demandes.détails';

const sectionTitle = 'Demandes à traiter';

export const DemandesSection = () =>
  SectionWithErrorHandling(
    withUtilisateur(async (utilisateur) => {
      const autorité = utilisateur.estDreal() ? 'dreal' : 'dgec';
      const { withNew, withNoNew } = await getDemandes(utilisateur, autorité);

      return (
        <Section
          title={sectionTitle}
          picto={<Contract color="yellow-moutarde" fontSize="large" />}
          className="border-none"
        >
          <DemandesDétails withNew={withNew} withNoNew={withNoNew} autorité={autorité} />
        </Section>
      );
    }),
    sectionTitle,
  );

const getDemandes = async (utilisateur: PotentielUtilisateur, autorité: 'dreal' | 'dgec') => {
  const nombreDemandesEnInstruction = await getNombreDemandesEnInstruction({
    utilisateur: utilisateur.identifiantUtilisateur.email,
    rôle: autorité,
  });

  return {
    withNew: nombreDemandesEnInstruction.filter((demande) => demande.new > 0),
    withNoNew: nombreDemandesEnInstruction.filter((demande) => demande.new === 0),
  };
};
