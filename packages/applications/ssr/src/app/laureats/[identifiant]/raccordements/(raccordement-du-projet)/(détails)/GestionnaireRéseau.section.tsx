import Notice from '@codegouvfr/react-dsfr/Notice';
import { notFound } from 'next/navigation';

import type { IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import { Section } from '@/components/atoms/section/Section';
import { SectionWithErrorHandling } from '@/components/atoms/section/SectionWithErrorHandling';
import { CopyButton } from '@/components/molecules/CopyButton';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getRaccordement } from '../../../_helpers';
import { getGestionnaireRéseauAction, getLauréatOrRedirect } from './_helpers';

export type GestionnaireRéseauSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Gestionnaire de réseau';

export const GestionnaireRéseauSection = ({ identifiantProjet }: GestionnaireRéseauSectionProps) =>
  SectionWithErrorHandling(
    withUtilisateur(async (utilisateur) => {
      const raccordement = await getRaccordement(identifiantProjet);
      const lauréat = await getLauréatOrRedirect(identifiantProjet);

      if (!raccordement) {
        return notFound();
      }

      const gestionnaireRéseau = raccordement?.gestionnaireRéseau;

      const action = getGestionnaireRéseauAction({
        rôle: utilisateur.rôle,
        estProjetAchevé: lauréat.statut.estAchevé(),
        estInconnuGestionnaire: raccordement.identifiantGestionnaireRéseau.estInconnu(),
        aUnDossierEnService:
          raccordement.dossiers.filter((dossier) => !!dossier.dateMiseEnService?.date).length > 0,
        identifiantProjet,
      });

      return (
        <Section title="" className="pt-0">
          {Option.isNone(gestionnaireRéseau) ? (
            <Notice
              severity="warning"
              title="Gestionnaire de réseau inconnu"
              className="mb-6"
              link={
                action
                  ? {
                      linkProps: {
                        href: action.href,
                        target: '_self',
                      },
                      text: action.label,
                    }
                  : undefined
              }
            />
          ) : (
            <div className="flex flex-col gap-1">
              <div className="flex flex-col">
                <div>
                  Gestionnaire de réseau :{' '}
                  <span className="font-semibold">{gestionnaireRéseau.raisonSociale}</span>
                </div>
                {gestionnaireRéseau.contactEmail && (
                  <div className="flex items-center gap-2">
                    Contact :{' '}
                    <CopyButton
                      textToCopy={gestionnaireRéseau.contactEmail.email}
                      aria-label="Copier"
                    />
                  </div>
                )}
              </div>
              {action && (
                <TertiaryLink href={action.href} aria-label={action.label}>
                  {action.label}
                </TertiaryLink>
              )}
            </div>
          )}
        </Section>
      );
    }),
    sectionTitle,
  );
