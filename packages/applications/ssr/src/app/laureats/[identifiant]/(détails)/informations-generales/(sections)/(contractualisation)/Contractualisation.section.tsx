import { Routes } from '@potentiel-applications/routes';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import {
  getAction,
  getLauréatInfos,
  getPuissanceInfos,
  SectionWithErrorHandling,
} from '@/app/laureats/[identifiant]/_helpers';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { Section } from '../../../(components)/Section';

import { ContractualisationDétails } from './ContractualisationDétails';

type ContractualisationSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Contractualisation';

export const ContractualisationSection = ({
  identifiantProjet: identifiantProjetValue,
}: ContractualisationSectionProps) =>
  SectionWithErrorHandling(
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

      const prixRéférence = rôle.aLaPermission('projet.accèsDonnées.prix')
        ? lauréat.prixReference
        : Option.none;

      return (
        <Section title={sectionTitle}>
          <ContractualisationDétails
            prixRéférence={prixRéférence}
            coefficientKChoisi={lauréat.coefficientKChoisi}
            puissance={{ value, action }}
          />
        </Section>
      );
    }),
    sectionTitle,
  );
