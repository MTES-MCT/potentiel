export class AuthenticationError extends Error {
  constructor(cause?: Error) {
    super(`Authentification obligatoire`, { cause });
  }
}
