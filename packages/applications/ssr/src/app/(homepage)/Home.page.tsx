import type { PotentielUtilisateur } from '@potentiel-applications/request-context';

import { Bienvenue } from './Bienvenue';
import { Contexte } from './Contexte';
import { InscriptionConnexion } from './InscriptionConnexion';
import { PropositionDeValeur } from './PropositionDeValeur';

export type HomePageProps = {
  utilisateur?: PotentielUtilisateur;
};
export function HomePage({ utilisateur }: HomePageProps) {
  return (
    <>
      <PropositionDeValeur />
      {utilisateur ? <Bienvenue utilisateur={utilisateur} /> : <InscriptionConnexion />}
      <Contexte />
    </>
  );
}
