import Tooltip from '@mui/material/Tooltip';

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
          <ul>
            <li className="flex flex-col">
              <span>
                Identifiant Métier :{' '}
                <Tooltip title="Format d'identifiant utilisé dans les documents et courriers électroniques.">
                  <Icon id="ri-information-line" size="sm" />
                </Tooltip>
              </span>
              <CopyButton textToCopy={identifiantProjet.formatterMétier()} className="text-sm" />
            </li>
            <li className="flex flex-col">
              <span>
                Identifiant Technique :{' '}
                <Tooltip title="Format d'identifiant utilisé dans les fichiers CSV et dans les échanges par API.">
                  <Icon id="ri-information-line" size="sm" />
                </Tooltip>
              </span>

              <CopyButton textToCopy={identifiantProjet.formatter()} className="text-sm" />
            </li>
          </ul>
        </Section>
      );
    }),
    sectionTitle,
  );
