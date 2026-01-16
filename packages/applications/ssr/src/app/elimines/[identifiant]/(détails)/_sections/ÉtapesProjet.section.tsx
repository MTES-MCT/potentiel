import { notFound } from 'next/navigation';

import { IdentifiantProjet, Éliminé } from '@potentiel-domain/projet';

import { withUtilisateur } from '@/utils/withUtilisateur';
import { Section } from '@/components/atoms/menu/Section';
import { SectionWithErrorHandling } from '@/components/atoms/menu/SectionWithErrorHandling';

import { getÉliminé } from '../../../../_helpers/getÉliminé';
import { getRecours } from '../../../../_helpers/getRecours';

import { EtapesProjet, ÉtapeProjet } from './ÉtapesProjet';

type ÉtapesProjetSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = 'Étapes du projet';

export const ÉtapesProjetSection = ({
  identifiantProjet: identifiantProjetValue,
}: ÉtapesProjetSectionProps) =>
  SectionWithErrorHandling(
    withUtilisateur(async () => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);
      const recours = await getRecours(identifiantProjet.formatter());
      const éliminé = await getÉliminé(identifiantProjet.formatter());

      if (!éliminé) {
        return notFound();
      }

      const étapes = mapToÉtapesData({
        éliminé,
        recours,
      });

      return (
        <Section title={sectionTitle} className="min-w-0">
          <EtapesProjet
            étapes={étapes}
            identifiantProjet={identifiantProjetValue}
            doitAfficherAttestationDésignation={!!éliminé.attestationDésignation}
          />
        </Section>
      );
    }),
    sectionTitle,
  );

type GetÉtapesData = {
  éliminé: Éliminé.ConsulterÉliminéReadModel;
  recours?: Éliminé.Recours.ConsulterRecoursReadModel;
};

const mapToÉtapesData = ({ éliminé, recours }: GetÉtapesData) => {
  const étapes: Array<ÉtapeProjet> = [
    {
      type: 'designation',
      date: éliminé.notifiéLe.formatter(),
    },
  ];

  if (recours?.statut.estEnCours()) {
    étapes.push({
      type: 'recours-demandé',
      date: recours.dateDemande.formatter(),
    });
  }

  if (recours?.statut.estAnnulé()) {
    étapes.push({
      type: 'recours-annulé',
      date: recours.dateDemande.formatter(),
    });
  }

  if (recours?.statut.estRejeté()) {
    étapes.push({
      type: 'recours-rejeté',
      date: recours.dateDemande.formatter(),
    });
  }

  return étapes
    .filter((a) => a.date)
    .sort((a, b) => a.date!.localeCompare(b.date!))
    .concat(étapes.filter((a) => !a.date));
};
