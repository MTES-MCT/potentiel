import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { mapToPlainObject } from '@potentiel-domain/core';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { getAction } from '@/app/laureats/[identifiant]/_helpers/getAction';
import { getReprésentantLégalInfos } from '@/app/laureats/[identifiant]/_helpers/getLauréat';

import { Section } from '../../../(components)/Section';

import { ReprésentantLégalDétails } from './ReprésentantLégalDétails';

type ReprésentantLégalSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const ReprésentantLégalSection = ({
  identifiantProjet: identifiantProjetValue,
}: ReprésentantLégalSectionProps) =>
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
      <Section title="Représentant légal">
        <ReprésentantLégalDétails value={value} action={action} />
      </Section>
    );
  });
