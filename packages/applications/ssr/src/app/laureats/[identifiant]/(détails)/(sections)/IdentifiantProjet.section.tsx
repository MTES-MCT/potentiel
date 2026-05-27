import Tooltip from '@codegouvfr/react-dsfr/Tooltip';

import { IdentifiantProjet } from '@potentiel-domain/projet';

import { Icon } from '@/components/atoms/Icon';
import { Section } from '@/components/atoms/menu/Section';
import { SectionWithErrorHandling } from '@/components/atoms/menu/SectionWithErrorHandling';
import { CopyButton } from '@/components/molecules/CopyButton';
import { withUtilisateur } from '@/utils/withUtilisateur';

type IdentifiantProjetSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Identifiants';

export const IdentifiantProjetSection = ({
  identifiantProjet: rawIdentifiant,
}: IdentifiantProjetSectionProps) =>
  SectionWithErrorHandling(
    withUtilisateur(async ({ rôle }) => {
      if (!rôle.aLaPermission('projet.accèsIdentifiants')) {
        return null;
      }
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(rawIdentifiant);
      return (
        <Section title={sectionTitle}>
          <ul className="flex flex-col gap-1">
            <li>
              <span>Identifiant Projet : </span>
              <CopyButton textToCopy={identifiantProjet.formatterMétier()} />
            </li>
            <li>
              <span>
                Identifiant Technique :{' '}
                <Tooltip title="Format d'identifiant utilisé dans les fichiers CSV et dans les échanges par API.">
                  <Icon size="sm" id="fr-icon-question-line" />
                </Tooltip>
              </span>
              <CopyButton textToCopy={identifiantProjet.formatter()} />
            </li>
          </ul>
        </Section>
      );
    }),
    sectionTitle,
  );
