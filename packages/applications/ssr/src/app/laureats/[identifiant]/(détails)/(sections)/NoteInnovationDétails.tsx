type NotesInnovationDétails = {
  noteTotale: number;
  notePrix: string;
  notesInnovation: {
    note: string;
    degréInnovation: string;
    positionnement: string;
    qualitéTechnique: string;
    adéquationAmbitionsIndustrielles: string;
    aspectsEnvironnementauxEtSociaux: string;
  };
};

export const NoteInnovationDétails = ({
  noteTotale,
  notePrix,
  notesInnovation,
}: NotesInnovationDétails) => {
  return (
    <ul className="list-disc pl-4">
      <li className="mb-3">Note totale: {noteTotale}</li>
      <li>Note prix : {notePrix}</li>
      <li>
        Note innovation : {notesInnovation.note}
        {notesInnovation.note !== 'N/A' && (
          <ul className="list-disc pl-4">
            <li>Note degré d’innovation (/20pt) : {notesInnovation.degréInnovation}</li>
            <li>Note positionnement sur le marché (/10pt) : {notesInnovation.positionnement}</li>
            <li>Note qualité technique (/5pt) : {notesInnovation.qualitéTechnique}</li>
            <li>
              Note adéquation du projet avec les ambitions industrielles (/5pt) :{' '}
              {notesInnovation.adéquationAmbitionsIndustrielles}
            </li>
            <li>
              Note aspects environnementaux et sociaux (/5pt) :{' '}
              {notesInnovation.aspectsEnvironnementauxEtSociaux}
            </li>
          </ul>
        )}
      </li>
    </ul>
  );
};
