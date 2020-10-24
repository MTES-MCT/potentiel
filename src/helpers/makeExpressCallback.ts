import { Request, Response } from 'express'

import path from 'path'

import querystring from 'querystring'

import { User } from '../entities'

import { Controller } from '../types'

const login = (req: Request, user): Promise<void> => {
  return new Promise((resolve, reject) => {
    req.login(user, (err) => {
      if (err) reject(err)

      resolve()
    })
  })
}

function addQueryParams(url, query) {
  if (!query) return url
  return url + (url.indexOf('?') === -1 ? '?' : '&') + querystring.stringify(query)
}

export default function makeExpressCallback(controller: Controller) {
  return (req: Request, res: Response) => {
    const httpRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
      user: <User>req.user,
      file: req.file,
      cookies: req.cookies,
    }

    controller(httpRequest)
      .then((httpResponse) => {
        if ('cookies' in httpResponse) {
          Object.entries(httpResponse.cookies || {}).forEach(([key, value]) => {
            res.cookie(key, value, {
              maxAge: 1000 * 60 * 60 * 24 * 30 * 3, // 3 months
              httpOnly: true,
            })
          })
        }

        if ('redirect' in httpResponse) {
          // If user is provided, log him in
          return (httpResponse.userId
            ? login(req, { id: httpResponse.userId })
            : Promise.resolve()
          ).then(() => {
            if (httpResponse.logout) req.logout()
            res.redirect(addQueryParams(httpResponse.redirect, httpResponse.query))
          })
        } else if ('filePath' in httpResponse) {
          res.sendFile(path.resolve(process.cwd(), httpResponse.filePath))
        } else if ('fileStream' in httpResponse) {
          httpResponse.fileStream.pipe(res)
        } else {
          if (httpResponse.logout) req.logout()
          res.status(httpResponse.statusCode)
          if (typeof httpResponse.body === 'string') {
            res.send(httpResponse.body)
          } else {
            res.json(httpResponse.body)
          }
        }
      })
      .catch((e) => {
        console.log('makeExpressCallback error', e)
        res
          .status(500)
          .send('Une erreur est survenue. Merci de nous excuser de la gène occasionnée.')
      })
  }
}
