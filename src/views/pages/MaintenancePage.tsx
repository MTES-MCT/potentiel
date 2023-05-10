import React from 'react';
import { Container, Heading1 } from '@components';
import { hydrateOnClient, afficherDateAvecHeure } from '../helpers';

export type MaintenanceProps = {
  dateFinMaintenance: string;
};

export const Maintenance = ({ dateFinMaintenance }: MaintenanceProps) => {
  const date = afficherDateAvecHeure(Number(dateFinMaintenance));
  return (
    <>
      <main
        role="main"
        style={{ fontFamily: 'Marianne, arial, sans-serif' }}
        className="min-h-screen flex items-center"
      >
        <Container className="px-4 py-3 mb-4 md:flex md:flex-row md:justify-center md:items-center">
          <div className="md:w-1/2 p-5">
            <Heading1 className="mb-6">Site en maintenance</Heading1>
            <p>
              Désolé, le site est actuellement en maintenance jusqu'au{' '}
              <span className="font-bold">{date}</span>. Merci de vous reconnecter à ce moment.
            </p>
          </div>
          <img
            src="/images/home/enr-illustration.png"
            aria-hidden={true}
            className="w-full md:w-1/2"
          />
        </Container>
      </main>
    </>
  );
};

hydrateOnClient(Maintenance);
