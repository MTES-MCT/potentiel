import multer from 'multer';

import type core from 'express-serve-static-core';

import { promises as fs } from 'fs';
import { logger } from '../core/utils';

export const FILE_SIZE_LIMIT_IN_MB = 25;

const uploadWithMulter = multer({
  dest: 'temp',
  limits: { fileSize: FILE_SIZE_LIMIT_IN_MB * 1024 * 1024 /* MB */ },
});

export const upload = {
  single:
    (
      filename: string,
      errorCallback: (request: core.Request, response: core.Response, error: string) => void,
    ) =>
    (req, response, next) => {
      const uploadHandler = uploadWithMulter.single(filename);

      uploadHandler(req, response, (err) => {
        if (err) {
          logger.error(err);
          return errorCallback(
            req,
            response,
            `Le fichier ne pas dépasser ${FILE_SIZE_LIMIT_IN_MB} Mo`,
          );
        }

        response.on('finish', async () => {
          if (req.file) {
            try {
              await fs.unlink(req.file.path);
            } catch (error) {
              logger.error(error);
            }
          }
        });

        next();
      });
    },
  multiple: (filename?: string) => (req, res, next) => {
    return filename
      ? uploadWithMulter.array(filename)(req, res, next)
      : uploadWithMulter.any()(req, res, next);
  },
};
