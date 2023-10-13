'use client';
import { ListResult } from '@potentiel/core-domain-views';
import { AbandonReadModel } from '@potentiel/domain-views';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ListeAbandonsPage() {
  const [abandons, setAbandons] = useState<ListResult<AbandonReadModel>>({
    currentPage: 1,
    items: [],
    itemsPerPage: 10,
    totalItems: 0,
  });
  useEffect(() => {
    const fetchAbandons = async () => {
      const response = await fetch('/api/v1/abandon?page=1&itemsPerPage=10');
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
                <Link href={`/app/abandon/${encodeURIComponent(identifiantProjet)}`}>Voir</Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
