import { Utilisateur } from '@potentiel-domain/utilisateur';

import { PropositionDeValeur } from '@/components/molecules/home/PropositionDeValeur';
import { Bienvenue } from '@/components/molecules/home/Bienvenue';
import { InscriptionConnexion } from '@/components/molecules/home/InscriptionConnexion';
import { Benefices } from '@/components/molecules/home/Benefices';

export type HomePageProps = {
  utilisateur?: Utilisateur.ValueType;
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
