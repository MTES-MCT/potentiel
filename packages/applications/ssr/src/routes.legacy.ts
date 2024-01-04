import * as routesLegacy from '@potentiel/legacy-routes';
import { Route } from 'next';

type RouteKey = keyof typeof routesLegacy;

const reformattedRoutes = Object.entries(routesLegacy).reduce<Record<RouteKey, Route>>(
  (acc, [key, value]) => {
    acc[key as RouteKey] = value as Route;
    return acc;
  },
  {} as Record<RouteKey, Route>,
);

/**
 * @deprecated À supprimer dès que tout le code legacy sera migré
 */
export const ROUTES_LEGACY = reformattedRoutes;
