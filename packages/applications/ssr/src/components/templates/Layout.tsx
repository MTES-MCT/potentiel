import { FC } from 'react';
import { Footer } from '../organisms/Footer';
import { Header } from '../organisms/Header';

type LayoutProps = {
  children: JSX.Element;
};

export const Layout: FC<LayoutProps> = ({ children }) => (
  <>
    <Header />
    <main id="contenu">{children}</main>
    <Footer />
  </>
);
