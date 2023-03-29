import { logger } from '@core/utils';
import { getLogger } from '@potentiel/monitoring';

logger.on('debugLog', (message: string) => {
  getLogger().debug(message);
});

logger.on('infoLog', (message: string) => {
  getLogger().info(message);
});

logger.on('warningLog', (message: string) => {
  getLogger().warn(message);
});

logger.on('errorLog', (exception: Error | string) => {
  const error = typeof exception === 'string' ? new Error(exception) : exception;
  getLogger().error(error);
});
