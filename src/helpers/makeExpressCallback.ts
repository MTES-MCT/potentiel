import { Request, Response, NextFunction } from 'express'

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

const logout = async (req: Request) => {
  req.logout()
}

function addQueryParams(url, query) {
  if (!query) return url
  return (
    url + (url.indexOf('?') === -1 ? '?' : '&') + querystring.stringify(query)
  )
}

export default function makeExpressCallback(controller: Controller) {
  return (req: Request, res: Response) => {
    const httpRequest = {
      body: req.body,
      query: req.query,
      params: req.params,
      user: <User>req.user,
      file: req.file,
      // ip: req.ip,
      // method: req.method,
      // path: req.path,
      // headers: {
      //   'Content-Type': req.get('Content-Type'),
      //   Referer: req.get('referer'),
      //   'User-Agent': req.get('User-Agent')
      // }
    }

    controller(httpRequest)
      .then((httpResponse) => {
        // if (httpResponse.headers) {
        //   res.set(httpResponse.headers)
        // }
        // res.type('json')

        if ('redirect' in httpResponse) {
          // If user is provided, log him in
          return (httpResponse.userId
            ? login(req, { id: httpResponse.userId })
            : Promise.resolve()
          ).then(() => {
            if (httpResponse.logout) req.logout()
            res.redirect(
              addQueryParams(httpResponse.redirect, httpResponse.query)
            )
          })
        } else if ('filePath' in httpResponse) {
          res.sendFile(path.resolve(process.cwd(), httpResponse.filePath))
        } else {
          if (httpResponse.logout) req.logout()
          res.status(httpResponse.statusCode).send(httpResponse.body)
        }
      })
      .catch((e) => {
        console.log('makeExpressCallback error', e)
        res
          .status(500)
          .send(
            'Une erreur est survenue. Merci de nous excuser de la gène occasionnée.'
          )
      })
  }
}
