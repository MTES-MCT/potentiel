import { mediator } from 'mediateur';
import { notFound } from 'next/navigation';

import { Candidature, IdentifiantProjet } from '@potentiel-domain/projet';
import { Option } from '@potentiel-libraries/monads';

import { withUtilisateur } from '@/utils/withUtilisateur';

import { Section } from '../(components)/Section';
import { SectionWithErrorHandling } from '../../_helpers';

import { NoteInnovationDétails } from './NoteInnovationDétails';
import { getCahierDesCharges } from '../../../../_helpers';

type NoteInnovationSectionProps = {
  identifiantProjet: IdentifiantProjet.RawType;
};

const sectionTitle = "Résultats de l'appel d'offres";

export const NoteInnovationSection = ({
  identifiantProjet: identifiantProjetValue,
}: NoteInnovationSectionProps) =>
  SectionWithErrorHandling(
    withUtilisateur(async ({ rôle }) => {
      const identifiantProjet = IdentifiantProjet.convertirEnValueType(identifiantProjetValue);

      const cahierDesCharges = await getCahierDesCharges(identifiantProjet.formatter());
      if (
        cahierDesCharges.appelOffre.typeAppelOffre !== 'innovation' ||
        !rôle.aLaPermission('candidature.consulterDétail') ||
        !rôle.aLaPermission('candidature.consulter')
      ) {
        return null;
      }

      const notes = await getNotes(identifiantProjet.formatter());

      return (
        <Section title={sectionTitle}>
          <NoteInnovationDétails
            noteTotale={notes.noteTotale}
            notePrix={notes.notePrix}
            notesInnovation={notes.notesInnovation}
          />
        </Section>
      );
    }),
    sectionTitle,
  );

const getNotes = async (identifiantProjet: IdentifiantProjet.RawType) => {
  const détailsCandidature = await mediator.send<Candidature.ConsulterDétailCandidatureQuery>({
    type: 'Candidature.Query.ConsulterDétailCandidature',
    data: {
      identifiantProjet: identifiantProjet,
    },
  });

  if (Option.isNone(détailsCandidature)) {
    return notFound();
  }

  const candidature = await mediator.send<Candidature.ConsulterCandidatureQuery>({
    type: 'Candidature.Query.ConsulterCandidature',
    data: {
      identifiantProjet: identifiantProjet,
    },
  });

  if (Option.isNone(candidature)) {
    return notFound();
  }

  return {
    noteTotale: candidature.instruction.noteTotale,
    notePrix: formatterNote(détailsCandidature.détail['Note prix']),
    notesInnovation: {
      note: formatterNote(détailsCandidature.détail['Note innovation\n(AO innovation)']),
      degréInnovation: formatterNote(
        détailsCandidature.détail['Note degré d’innovation (/20pt)\n(AO innovation)'],
      ),
      positionnement: formatterNote(
        détailsCandidature.détail['Note positionnement sur le marché (/10pt)\n(AO innovation)'],
      ),
      qualitéTechnique: formatterNote(
        détailsCandidature.détail['Note qualité technique (/5pt)\n(AO innovation)'],
      ),
      adéquationAmbitionsIndustrielles: formatterNote(
        détailsCandidature.détail[
          'Note adéquation du projet avec les ambitions industrielles (/5pt)\n(AO innovation)'
        ],
      ),
      aspectsEnvironnementauxEtSociaux: formatterNote(
        détailsCandidature.détail[
          'Note aspects environnementaux et sociaux (/5pt)\n(AO innovation)'
        ],
      ),
    },
  };
};

const formatterNote = (note?: string) => {
  if (note) {
    const noteParsée = parseFloat(note.replace(',', '.'));

    return isNaN(noteParsée) ? 'N/A' : (Math.round(noteParsée * 100) / 100).toString();
  }
  return 'N/A';
};
