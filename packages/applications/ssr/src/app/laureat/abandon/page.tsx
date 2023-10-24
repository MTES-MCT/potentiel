'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Abandon } from '@potentiel-domain/laureat';

export default function ListeAbandonsPage() {
  const [abandons, setAbandons] = useState<Abandon.ListerAbandonReadModel>({
    currentPage: 1,
    items: [],
    itemsPerPage: 10,
    totalItems: 0,
  });
  useEffect(() => {
    const fetchAbandons = async () => {
      const response = await fetch('/api/v1/laureat/abandon?page=1&itemsPerPage=10');
      const data = await response.json();
      console.table(data);
      setAbandons(data);
    };

    fetchAbandons();
  }, []);
  return (
    <>
      <ul className="flex flex-col p-0 m-0 gap-4">
        {abandons.items.map(({ identifiantProjet, statut, demandeDemandéLe }) => (
          <li className="list-none p-0 m-0" key={`${identifiantProjet}`}>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col md:flex-row gap-2">
                <div>
                  <span>Identifiant du projet</span>
                  <span className="font-bold">{identifiantProjet}</span>
                </div>
              </div>
              <div className="flex flex-row gap-1 text-sm italic items-center">
                {demandeDemandéLe}
              </div>
              <div className="flex ml-auto">{statut}</div>
              <div>
                <Link
                  href={`/laureat/${encodeURIComponent(identifiantProjet)}/abandon/instruction`}
                >
                  Voir
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
