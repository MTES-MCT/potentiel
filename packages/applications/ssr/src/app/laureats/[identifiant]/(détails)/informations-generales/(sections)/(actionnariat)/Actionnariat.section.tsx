import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Candidature, IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';

import { withUtilisateur } from '@/utils/withUtilisateur';

import { Section } from '../../../(components)/Section';
import { getLauréatInfos } from '../../../../_helpers/getLauréat';
import { getAction } from '../../../../_helpers/getAction';
import { getGarantiesFinancières } from '../../../_helpers/getGarantiesFinancières';
import { getCahierDesCharges } from '../../../../../../_helpers';

import { ActionnariatDétails, ActionnariatDétailsProps } from './ActionnariatDétails';

type ActionnariatSectionProps = {
  identifiantProjet: string;
};

export const ActionnariatSection = ({
  identifiantProjet: identifiantProjetValue,
}: ActionnariatSectionProps) =>
  withUtilisateur(async ({ rôle }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const lauréat = await getLauréatInfos(identifiantProjet.formatter());

    const actionnaire = await getActionnaire({
      identifiantProjet,
      rôle,
      actionnariat: lauréat.actionnariat,
    });

    return (
      <Section title="Actionnariat">
        <ActionnariatDétails
          actionnariat={lauréat.actionnariat ? mapToPlainObject(lauréat.actionnariat) : undefined}
          actionnaire={actionnaire}
        />
      </Section>
    );
  });

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: Role.ValueType;
  actionnariat?: Candidature.TypeActionnariat.ValueType;
};

export const getActionnaire = async ({
  identifiantProjet,
  rôle,
  actionnariat,
}: Props): Promise<ActionnariatDétailsProps['actionnaire']> => {
  const projection = await mediator.send<Lauréat.Actionnaire.ConsulterActionnaireQuery>({
    type: 'Lauréat.Actionnaire.Query.ConsulterActionnaire',
    data: { identifiantProjet: identifiantProjet.formatter() },
  });

  if (Option.isNone(projection)) {
    return notFound();
  }

  const { actuelles, dépôt } = await getGarantiesFinancières(identifiantProjet.formatter());

  const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());

  const instructionChangementActionnaire =
    Lauréat.Actionnaire.InstructionChangementActionnaire.bind({
      aDesGarantiesFinancièresConstituées: !!actuelles,
      aUnDépotEnCours: !!dépôt,
      typeActionnariat: actionnariat,
    });

  const nécessiteInstruction = !!(
    rôle.estPorteur() &&
    cahierDesCharges.getRèglesChangements('actionnaire').demande &&
    instructionChangementActionnaire.estRequise()
  );

  const value = mapToPlainObject(projection);

  if (projection.dateDemandeEnCours) {
    return {
      value,
      action: rôle.aLaPermission('actionnaire.consulterChangement')
        ? {
            url: Routes.Actionnaire.changement.détails(
              identifiantProjet.formatter(),
              projection.dateDemandeEnCours.formatter(),
            ),
            label: 'Voir la demande de modification',
          }
        : undefined,
    };
  }

  // TODO:
  // règle spécifique à AOS, à rapatrier dans les règles métier présentes dans les AO si besoin
  const estPetitPV = identifiantProjet.appelOffre === 'PPE2 - Petit PV Bâtiment';

  const action = estPetitPV
    ? undefined
    : await getAction({
        identifiantProjet,
        rôle,
        domain: 'actionnaire',
        nécessiteInstruction,
      });

  return {
    value,
    action,
  };
};
