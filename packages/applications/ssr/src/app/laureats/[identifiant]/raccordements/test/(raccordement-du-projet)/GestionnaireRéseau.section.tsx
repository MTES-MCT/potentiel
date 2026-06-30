import Alert from '@codegouvfr/react-dsfr/Alert';
import { notFound } from 'next/navigation';

import type { IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { TertiaryLink } from '@/components/atoms/form/TertiaryLink';
import { Icon } from '@/components/atoms/Icon';
import { Link } from '@/components/atoms/LinkNoPrefetch';
import { Section } from '@/components/atoms/section/Section';
import { SectionWithErrorHandling } from '@/components/atoms/section/SectionWithErrorHandling';
import { CopyButton } from '@/components/molecules/CopyButton';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { getRaccordement } from '../../../_helpers';
import {
  getGestionnaireRéseauActionTest,
  getLauréatOrRedirect,
} from '../../(raccordement-du-projet)/(détails)/_helpers';

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

      const action = getGestionnaireRéseauActionTest({
        rôle: utilisateur.rôle,
        estProjetAchevé: lauréat.statut.estAchevé(),
        estInconnuGestionnaire: raccordement.identifiantGestionnaireRéseau.estInconnu(),
        aUnDossierEnService:
          raccordement.dossiers.filter(
            (dossier) => !!dossier.miseEnService?.dateMiseEnService?.date,
          ).length > 0,
        identifiantProjet,
      });

      return (
        <Section title={sectionTitle}>
          {Option.isNone(gestionnaireRéseau) ? (
            <Alert
              severity="warning"
              title="Gestionnaire de réseau inconnu"
              className="mb-6"
              description={
                action && (
                  <div className="flex flex-row">
                    <div>
                      <Link className="ml-1" href={action.href} aria-label={action.label}>
                        <Icon id="fr-icon-add-circle-line" size="xs" className="mr-1" />
                        {action.label}
                      </Link>
                    </div>
                  </div>
                )
              }
            />
          ) : (
            <div className="mt-2 mb-4 p-0">
              <div className="flex flex-col gap-1">
                <div className="flex flex-col">
                  <div>
                    Nom du gestionnaire de réseau :{' '}
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
            </div>
          )}
        </Section>
      );
    }),
    sectionTitle,
  );
