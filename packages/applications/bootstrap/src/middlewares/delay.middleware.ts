import { Middleware } from 'mediateur';

export const delayMiddleware: Middleware = async (message, next) => {
  const result = await next();
  // Avec l'évolution de la stack technique, le front next est devenu plus rapide que le processing des events
  // Il faudrait traiter cela de manière réactive
  // En attendant de pouvoir se pencher sur le sujet (probablement aprés la suppression définitive de l'application legacy)
  // Ce middleware applique un delay pour éviter les problèmes de consistance UI.
  // Solution quick and dirty temporaire valider avec l'ensemble de l'équipe
  if (message.type.includes('.UseCase.')) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  return result;
};
