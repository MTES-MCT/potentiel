import { IdentifiantProjet } from '@potentiel-domain/projet';
import { mapToPlainObject } from '@potentiel-domain/core';
import { Routes } from '@potentiel-applications/routes';

import { withUtilisateur } from '@/utils/withUtilisateur';

import { Section } from '../../../(components)/Section';
import { getLauréatInfos } from '../../../../_helpers/getLauréat';

import { CandidatDétails } from './CandidatDétails';

type CandidatSectionProps = {
  identifiantProjet: string;
};

export const CandidatSection = ({
  identifiantProjet: identifiantProjetValue,
}: CandidatSectionProps) =>
  withUtilisateur(async ({ rôle }) => {
    const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
    const lauréat = await getLauréatInfos(identifiantProjet.formatter());

    const localité = {
      value: mapToPlainObject(lauréat.localité),
      action: rôle.aLaPermission('lauréat.modifierSiteDeProduction')
        ? {
            url: Routes.Lauréat.modifierSiteDeProduction(identifiantProjet.formatter()),
            label: 'Modifier',
          }
        : undefined,
    };

    return (
      <Section title="Candidat">
        <CandidatDétails localité={localité} emailContact={lauréat.emailContact.email} />
      </Section>
    );
  });
