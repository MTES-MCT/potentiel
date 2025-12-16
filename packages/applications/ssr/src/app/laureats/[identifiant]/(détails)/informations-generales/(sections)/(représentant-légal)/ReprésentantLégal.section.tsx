import { mediator } from 'mediateur';

import { IdentifiantProjet, Lauréat } from '@potentiel-domain/projet';
import { Routes } from '@potentiel-applications/routes';
import { Option } from '@potentiel-libraries/monads';

import { withUtilisateur } from '@/utils/withUtilisateur';

import {
  ReprésentantLégalDétails,
  ReprésentantLégalDétailsProps,
} from './ReprésentantLégalDétails';
import { notFound } from 'next/navigation';
import { checkAutorisationChangement } from '../../../../_helpers/checkAutorisationChangement';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Section } from '../../../(components)/Section';
import { Role } from '@potentiel-domain/utilisateur';

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

  const { peutModifier, peutFaireUneDemandeDeChangement, peutEnregistrerChangement } =
    await checkAutorisationChangement<'représentantLégal'>({
      identifiantProjet,
      rôle,
      domain: 'représentantLégal',
    });

  const action = peutModifier
    ? {
        url: Routes.ReprésentantLégal.modifier(identifiantProjet.formatter()),
        label: 'Modifier',
        labelActions: 'Modifier le représentant légal',
      }
    : peutFaireUneDemandeDeChangement || peutEnregistrerChangement
      ? {
          url: peutFaireUneDemandeDeChangement
            ? Routes.ReprésentantLégal.changement.demander(identifiantProjet.formatter())
            : Routes.ReprésentantLégal.changement.enregistrer(identifiantProjet.formatter()),
          label: 'Changer de représentant légal',
          labelActions: 'Changer de représentant légal',
        }
      : undefined;

  return {
    value,
    action,
  };
};
