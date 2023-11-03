import { FC } from 'react';
import { Footer } from '../organisms/Footer';
import { Header } from '../organisms/Header';
import { fr } from '@codegouvfr/react-dsfr';

type LayoutProps = {
  children: JSX.Element;
};

export const Layout: FC<LayoutProps> = ({ children }) => (
  <>
    <Header />

    <div
      style={{
        flex: 1,
        ...fr.spacing('padding', {
          topBottom: '10v',
        }),
      }}
      className="fr-container"
    >
      {children}
    </div>

    <Footer />
  </>
);
