export type CommandHandler<TCommand> = (command: TCommand) => Promise<void>;
