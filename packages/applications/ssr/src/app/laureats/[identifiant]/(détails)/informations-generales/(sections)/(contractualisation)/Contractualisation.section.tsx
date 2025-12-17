import { Routes } from '@potentiel-applications/routes';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';

import {
  getAction,
  getLauréatInfos,
  getPuissanceInfos,
} from '@/app/laureats/[identifiant]/_helpers';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { Section } from '../../../(components)/Section';

import { ContractualisationDétails } from './ContractualisationDétails';

type ContractualisationSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const ContractualisationSection = ({
  identifiantProjet: identifiantProjetValue,
}: ContractualisationSectionProps) =>
  withUtilisateur(async ({ rôle }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const lauréat = await getLauréatInfos(identifiantProjet.formatter());
    const puissance = await getPuissanceInfos(identifiantProjet.formatter());

    const value = mapToPlainObject(puissance);

    const action = puissance.dateDemandeEnCours
      ? rôle.aLaPermission('puissance.consulterChangement')
        ? {
            url: Routes.Puissance.changement.détails(
              identifiantProjet.formatter(),
              puissance.dateDemandeEnCours.formatter(),
            ),
            label: 'Voir la demande de modification',
          }
        : undefined
      : await getAction({
          identifiantProjet,
          rôle,
          domain: 'puissance',
        });

    return (
      <Section title="Contractualisation">
        <ContractualisationDétails
          prixRéférence={lauréat.prixReference}
          coefficientKChoisi={lauréat.coefficientKChoisi}
          puissance={{ value, action }}
        />
      </Section>
    );
  });
