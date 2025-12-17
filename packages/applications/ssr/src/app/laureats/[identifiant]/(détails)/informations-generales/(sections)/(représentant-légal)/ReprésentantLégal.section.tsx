import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Role } from '@potentiel-domain/utilisateur';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { getAction } from '@/app/laureats/[identifiant]/_helpers/getAction';

import { Section } from '../../../(components)/Section';

import {
  ReprésentantLégalDétails,
  ReprésentantLégalDétailsProps,
} from './ReprésentantLégalDétails';

type ReprésentantLégalSectionProps = {
  identifiantProjet: string;
};

export const ReprésentantLégalSection = ({
  identifiantProjet: identifiantProjetValue,
}: ReprésentantLégalSectionProps) =>
  withUtilisateur(async ({ rôle }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

    const { value, action } = await getReprésentantLégalData({ identifiantProjet, rôle });

    return (
      <Section title="Représentant légal">
        <ReprésentantLégalDétails value={value} action={action} />
      </Section>
    );
  });

type Props = {
  identifiantProjet: IdentifiantProjet.ValueType;
  rôle: Role.ValueType;
};

export const getReprésentantLégalData = async ({
  identifiantProjet,
  rôle,
}: Props): Promise<ReprésentantLégalDétailsProps> => {
  const projection = await mediator.send<Lauréat.ReprésentantLégal.ConsulterReprésentantLégalQuery>(
    {
      type: 'Lauréat.ReprésentantLégal.Query.ConsulterReprésentantLégal',
      data: { identifiantProjet: identifiantProjet.formatter() },
    },
  );

  if (Option.isNone(projection)) {
    return notFound();
  }

  const value = mapToPlainObject(projection);

  if (projection.demandeEnCours) {
    return {
      value,
      action: rôle.aLaPermission('représentantLégal.consulterChangement')
        ? {
            url: Routes.ReprésentantLégal.changement.détails(
              identifiantProjet.formatter(),
              projection.demandeEnCours.demandéLe,
            ),
            label: 'Voir la demande de modification',
          }
        : undefined,
    };
  }

  const action = await getAction({
    identifiantProjet,
    rôle,
    domain: 'représentantLégal',
  });

  return {
    value,
    action,
  };
};
