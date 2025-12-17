import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';
import { Role } from '@potentiel-domain/utilisateur';

import { withUtilisateur } from '@/utils/withUtilisateur';

import { Section } from '../../../(components)/Section';
import { getLauréatInfos } from '../../../../_helpers/getLauréat';

import {
  ContractualisationDétails,
  ContractualisationDétailsProps,
} from './ContractualisationDétails';
import { mapToPlainObject } from '@potentiel-domain/core';
import { getAction } from '../../../../_helpers/getAction';

type ContractualisationSectionProps = {
  identifiantProjet: string;
};

export const ContractualisationSection = ({
  identifiantProjet: identifiantProjetValue,
}: ContractualisationSectionProps) =>
  withUtilisateur(async ({ rôle }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const lauréat = await getLauréatInfos(identifiantProjet.formatter());

    const puissance = await getPuissance({ identifiantProjet, rôle });

    return (
      <Section title="Contractualisation">
        <ContractualisationDétails
          prixRéférence={lauréat.prixReference}
          coefficientKChoisi={lauréat.coefficientKChoisi}
          puissance={puissance}
        />
      </Section>
    );
  });

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: Role.ValueType;
};

export const getPuissance = async ({
  identifiantProjet,
  rôle,
}: Props): Promise<ContractualisationDétailsProps['puissance']> => {
  const projection = await mediator.send<Lauréat.Puissance.ConsulterPuissanceQuery>({
    type: 'Lauréat.Puissance.Query.ConsulterPuissance',
    data: { identifiantProjet: identifiantProjet.formatter() },
  });

  if (Option.isNone(projection)) {
    return notFound();
  }

  const value = mapToPlainObject(projection);

  if (projection.dateDemandeEnCours) {
    return {
      value,
      action: rôle.aLaPermission('puissance.consulterChangement')
        ? {
            url: Routes.Puissance.changement.détails(
              identifiantProjet.formatter(),
              projection.dateDemandeEnCours.formatter(),
            ),
            label: 'Voir la demande de modification',
          }
        : undefined,
    };
  }

  const action = await getAction({
    identifiantProjet,
    rôle,
    domain: 'puissance',
  });

  return {
    value,
    action,
  };
};
