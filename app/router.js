'use strict';
import Router from 'koa-router'
import initController from './api'
const router = new Router()

initController(router)

export default router