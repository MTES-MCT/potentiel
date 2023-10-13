'use client';
import { SubmitButton } from '@/components/submit-button';
import { AbandonReadModel } from '@potentiel/domain-views';
import { useEffect, useState } from 'react';
// @ts-ignore
import { experimental_useFormState as useFormState } from 'react-dom';
import { instructionAbandonAction } from './instructionAbandon.action';

const initialState = {
  message: null,
};

export default function DetailsAbandonPage({ params: { id } }: { params: { id: string } }) {
  const [abandon, setAbandon] = useState<AbandonReadModel>();
  const [needToUploadFile, setNeedToUploadFile] = useState(false);
  const [state, formAction] = useFormState(instructionAbandonAction, initialState);
  useEffect(() => {
    const fetchAbandon = async () => {
      console.log(id);
      const response = await fetch(`/api/v1/abandon/${id}`);
      const data = await response.json();
      setAbandon(data);
    };

    fetchAbandon();
  }, []);

  return (
    <>
      <ul className="flex flex-col p-0 m-0 gap-4">
        <li className="list-none p-0 m-0">{abandon?.demandeDemandéLe}</li>
        <li className="list-none p-0 m-0">{abandon?.demandeRaison}</li>
        <li className="list-none p-0 m-0">{abandon?.demandeRecandidature}</li>
        <li className="list-none p-0 m-0">{abandon?.identifiantProjet}</li>
        <li className="list-none p-0 m-0">{abandon?.identifiantDemande}</li>
      </ul>

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
