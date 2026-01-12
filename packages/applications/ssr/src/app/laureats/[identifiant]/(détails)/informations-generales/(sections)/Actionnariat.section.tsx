import { Routes } from '@potentiel-applications/routes';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import {
  getAction,
  getActionnaireInfos,
  getLauréatInfos,
  SectionWithErrorHandling,
} from '@/app/laureats/[identifiant]/_helpers';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { Section } from '../../(components)/Section';
import { changementActionnaireNécessiteInstruction } from '../../../../../_helpers/changementActionnaireNécessiteInstruction';

import { ActionnariatDétails } from './ActionnariatDétails';

type ActionnariatSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Actionnariat';

export const ActionnariatSection = ({
  identifiantProjet: identifiantProjetValue,
}: ActionnariatSectionProps) =>
  SectionWithErrorHandling(
    withUtilisateur(async ({ rôle }) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

      const lauréat = await getLauréatInfos(identifiantProjet.formatter());
      const actionnaire = await getActionnaireInfos(identifiantProjet.formatter());

      const value = mapToPlainObject(actionnaire);

      const nécessiteInstruction = await changementActionnaireNécessiteInstruction(
        identifiantProjet.formatter(),
      );

      const action = actionnaire.dateDemandeEnCours
        ? rôle.aLaPermission('actionnaire.consulterChangement')
          ? {
              url: Routes.Actionnaire.changement.détails(
                identifiantProjet.formatter(),
                actionnaire.dateDemandeEnCours.formatter(),
              ),
              label: 'Voir la demande de modification',
            }
          : undefined
        : await getAction({
            identifiantProjet,
            rôle,
            domain: 'actionnaire',
            nécessiteInstruction,
          });

      return (
        <Section title={sectionTitle}>
          <ActionnariatDétails
            actionnariat={lauréat.actionnariat ? mapToPlainObject(lauréat.actionnariat) : undefined}
            actionnaire={{ value, action }}
          />
        </Section>
      );
    }),
    sectionTitle,
  );
