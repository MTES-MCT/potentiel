import { makeHtml } from './index.html';
import { Error, AccèsNonAutorisé } from './pages';

export { App } from './App';

export const ErrorPage = (props: Parameters<typeof Error>[0]) =>
  makeHtml({
    Component: Error,
    props,
    title: 'Erreur',
  });

export const AccèsNonAutoriséPage = (props: Parameters<typeof AccèsNonAutorisé>[0]) =>
  makeHtml({
    Component: AccèsNonAutorisé,
    props,
  });
