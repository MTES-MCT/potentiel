'use client';
import { useEffect, useState } from 'react';
// @ts-ignore
import { Abandon } from '@potentiel-domain/laureat';
import { IdentifiantParameter } from '@/utils/identifiantParameter';

const initialState = {
  message: null,
};

export default function DetailsAbandonPage({ params: { identifiant } }: IdentifiantParameter) {
  const [abandon, setAbandon] = useState<Abandon.ConsulterAbandonReadModel>();

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
    </>
  );
}
