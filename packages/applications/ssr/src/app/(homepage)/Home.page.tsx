import { PotentielUtilisateur } from '@potentiel-applications/request-context';

import { Benefices } from './Benefices';
import { Bienvenue } from './Bienvenue';
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
      <Benefices />
    </>
  );
}
