'use client';
import { SubmitButton } from '@/components/submit-button';
import { useEffect, useState } from 'react';
// @ts-ignore
import { experimental_useFormState as useFormState } from 'react-dom';
import { Abandon } from '@potentiel-domain/laureat';
import { instructionAbandonAction } from './action';
import { IdentifiantParameter } from '@/utils/identifiantParameter';

const initialState = {
  message: null,
};

export default function DetailsAbandonPage({ params: { identifiant } }: IdentifiantParameter) {
  const [abandon, setAbandon] = useState<Abandon.ConsulterAbandonReadModel>();
  const [needToUploadFile, setNeedToUploadFile] = useState(false);
  const [state, formAction] = useFormState(instructionAbandonAction, initialState);
  useEffect(() => {
    const fetchAbandon = async () => {
      const response = await fetch(`/api/v1/laureat/abandon/${identifiant}`);
      const data = await response.json();
      setAbandon(data);
    };

    fetchAbandon();
  }, []);

  const instructionPossible = () => {
    return !['accordé', 'rejeté'].includes(abandon?.statut || '');
  };

  const demandeConfirmationPossible = () => {
    return abandon?.statut === 'demandé';
  };

  return (
    <>
      <ul>
        <li>{abandon?.demande.demandéLe}</li>
        <li>{abandon?.demande.raison}</li>
        {abandon?.demande.recandidature && (
          <li>
            Le projet s'inscrit dans un <span className="font-bold">contexte de recandidature</span>
          </li>
        )}
      </ul>
      {abandon?.demande.piéceJustificative && (
        <a href={`/laureat/${identifiant}/piece-justificative`} target="blank">
          Pièce Justificative
        </a>
      )}

      {instructionPossible() && (
        <form action={formAction}>
          <input type={'hidden'} value={abandon?.identifiantProjet} name="identifiantProjet" />
          {needToUploadFile && (
            <>
              <input type={'file'} id="reponse-signee" name="reponse-signee" />
              <br />
            </>
          )}
          <input
            type={'radio'}
            id="accorder"
            name="instruction"
            value="accorder"
            onClick={() => setNeedToUploadFile(!abandon?.demande.recandidature)}
          />
          <label htmlFor="accorder">Accorder</label>
          <br />
          {demandeConfirmationPossible() && (
            <>
              <input
                type={'radio'}
                id="demander-confirmation"
                name="instruction"
                value="demander-confirmation"
                onClick={() => setNeedToUploadFile(true)}
              />
              <label htmlFor="rejeter">Demander confirmation</label>
              <br />
            </>
          )}
          <input
            type={'radio'}
            id="rejeter"
            name="instruction"
            value="rejeter"
            onClick={() => setNeedToUploadFile(true)}
          />
          <label htmlFor="rejeter">Rejeter</label>
          <br />
          <SubmitButton />
        </form>
      )}
      <p>{state?.message}</p>
    </>
  );
}
