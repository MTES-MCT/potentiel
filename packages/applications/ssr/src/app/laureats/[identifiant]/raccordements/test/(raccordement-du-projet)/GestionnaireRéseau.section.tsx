import Alert from '@codegouvfr/react-dsfr/Alert';
import { notFound } from 'next/navigation';

import { Routes } from '@potentiel-applications/routes';
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
  getLauréatOrRedirect,
  getModificationGestionnaireRéseauAction,
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

      const peutModifier = getModificationGestionnaireRéseauAction({
        rôle: utilisateur.rôle,
        statutLauréat: lauréat.statut,
        identifiantGestionnaireActuel: raccordement.identifiantGestionnaireRéseau,
        aUnDossierEnService:
          raccordement.dossiers.filter(
            (dossier) => !!dossier.miseEnService?.dateMiseEnService?.date,
          ).length > 0,
      });

      return (
        <Section title={sectionTitle} className="flex-1">
          {Option.isNone(gestionnaireRéseau) ? (
            <Alert
              severity="warning"
              title="Gestionnaire de réseau inconnu"
              className="mb-6"
              description={
                peutModifier && (
                  <div className="flex flex-row">
                    <div>
                      <Link
                        className="ml-1"
                        href={Routes.Raccordement.modifierGestionnaireDeRéseau(identifiantProjet)}
                        aria-label="Ajouter un gestionnaire"
                      >
                        <Icon id="fr-icon-add-circle-line" size="xs" className="mr-1" />
                        Spécifier un gestionnaire de réseau
                      </Link>
                    </div>
                  </div>
                )
              }
            />
          ) : (
            <div className="mt-2 mb-4 p-0">
              <div className="flex flex-row gap-2">
                Nom du gestionnaire de réseau : {gestionnaireRéseau.raisonSociale}{' '}
                {peutModifier && (
                  <TertiaryLink
                    href={Routes.Raccordement.modifierGestionnaireDeRéseau(identifiantProjet)}
                    aria-label={`Modifier le gestionnaire actuel (${gestionnaireRéseau.raisonSociale})`}
                  >
                    <Icon id="fr-icon-pencil-fill" size="xs" className="mr-1" />
                    Modifier
                  </TertiaryLink>
                )}
              </div>
              {gestionnaireRéseau.contactEmail && (
                <div className="flex items-center gap-2 mt-2">
                  Contact : <CopyButton textToCopy={gestionnaireRéseau.contactEmail.email} />
                </div>
              )}
            </div>
          )}
        </Section>
      );
    }),
    sectionTitle,
  );
