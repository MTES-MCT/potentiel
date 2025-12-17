import { Routes } from '@potentiel-applications/routes';
import { mapToPlainObject } from '@potentiel-domain/core';
import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';

import { getCahierDesCharges } from '@/app/_helpers';
import {
  getAction,
  getActionnaireInfos,
  getGarantiesFinancières,
  getLauréatInfos,
} from '@/app/laureats/[identifiant]/_helpers';
import { withUtilisateur } from '@/utils/withUtilisateur';

import { Section } from '../../../(components)/Section';

import { ActionnariatDétails } from './ActionnariatDétails';

type ActionnariatSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

export const ActionnariatSection = ({
  identifiantProjet: identifiantProjetValue,
}: ActionnariatSectionProps) =>
  withUtilisateur(async ({ rôle }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const lauréat = await getLauréatInfos(identifiantProjet.formatter());
    const actionnaire = await getActionnaireInfos(identifiantProjet.formatter());
    const { actuelles, dépôt } = await getGarantiesFinancières(identifiantProjet.formatter());
    const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());

    const instructionChangementActionnaire =
      Lauréat.Actionnaire.InstructionChangementActionnaire.bind({
        aDesGarantiesFinancièresConstituées: !!actuelles,
        aUnDépotEnCours: !!dépôt,
        typeActionnariat: lauréat.actionnariat,
      });

    const nécessiteInstruction = !!(
      rôle.estPorteur() &&
      cahierDesCharges.getRèglesChangements('actionnaire').demande &&
      instructionChangementActionnaire.estRequise()
    );

    const value = mapToPlainObject(actionnaire);

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
      <Section title="Actionnariat">
        <ActionnariatDétails
          actionnariat={lauréat.actionnariat ? mapToPlainObject(lauréat.actionnariat) : undefined}
          actionnaire={{ value, action }}
        />
      </Section>
    );
  });
