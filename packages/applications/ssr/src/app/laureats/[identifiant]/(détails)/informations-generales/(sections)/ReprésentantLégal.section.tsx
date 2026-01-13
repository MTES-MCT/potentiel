import { Routes } from '@potentiel-applications/routes';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import { getAction, getReprésentantLégalInfos } from '@/app/laureats/[identifiant]/_helpers';
import { withUtilisateur } from '@/utils/withUtilisateur';
import { SectionWithErrorHandling } from '@/components/atoms/menu/SectionWithErrorHandling';
import { Section } from '@/components/atoms/menu/Section';

import { ReprésentantLégalDétails } from './ReprésentantLégalDétails';

type ReprésentantLégalSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Représentant légal';

export const ReprésentantLégalSection = ({
  identifiantProjet: identifiantProjetValue,
}: ReprésentantLégalSectionProps) =>
  SectionWithErrorHandling(
    withUtilisateur(async ({ rôle }) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

      const représentantLégal = await getReprésentantLégalInfos(identifiantProjet.formatter());

      const value = mapToPlainObject(représentantLégal);

      const action = représentantLégal.demandeEnCours
        ? rôle.aLaPermission('représentantLégal.consulterChangement')
          ? {
              url: Routes.ReprésentantLégal.changement.détails(
                identifiantProjet.formatter(),
                représentantLégal.demandeEnCours.demandéLe,
              ),
              label: 'Voir la demande de modification',
            }
          : undefined
        : await getAction({
            identifiantProjet,
            rôle,
            domain: 'représentantLégal',
          });

      return (
        <Section title={sectionTitle}>
          <ReprésentantLégalDétails value={value} action={action} />
        </Section>
      );
    }),
    sectionTitle,
  );
