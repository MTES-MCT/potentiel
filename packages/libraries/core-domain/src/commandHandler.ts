export type CommandHandler<TCommand> = (command: TCommand) => Promise<void>;

export type CommandHandlerFactory<TCommand, TDependencies extends Record<string, unknown>> = (
  dependencies: TDependencies,
) => CommandHandler<TCommand>;
