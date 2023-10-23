'use client';
import { SubmitButton } from '@/components/submit-button';
import { useEffect, useState } from 'react';
// @ts-ignore
import { experimental_useFormState as useFormState } from 'react-dom';
import { Abandon } from '@potentiel-domain/laureat';
import { instructionAbandonAction } from './instructionAbandon.action';
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

  return (
    <>
      <ul className="flex flex-col p-0 m-0 gap-4">
        <li className="list-none p-0 m-0">{abandon?.demande.demandéLe}</li>
        <li className="list-none p-0 m-0">{abandon?.demande.raison}</li>
        <li className="list-none p-0 m-0">{abandon?.demande.recandidature}</li>
        <li className="list-none p-0 m-0">{abandon?.identifiantProjet}</li>
      </ul>
      {abandon?.demande.piéceJustificative && (
        <a href={`/laureat/${identifiant}/piece-justificative`} target="blank">
          Pièce Justificative
        </a>
      )}

      <form action={formAction}>
        <input type={'hidden'} value={abandon?.identifiantProjet} name="identifiantProjet" />
        {needToUploadFile ? (
          <>
            <input type={'file'} id="reponse-signee" name="reponse-signee" />
            <br />
          </>
        ) : (
          ''
        )}
        <input
          type={'radio'}
          id="accorder"
          name="instruction"
          value="accorder"
          onClick={() => setNeedToUploadFile(false)}
        />
        <label htmlFor="accorder">Accorder</label>
        <br />
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
      <p>{state?.message}</p>
    </>
  );
}
