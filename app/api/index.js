'use strict';
import initClient from './client'
import initComment from './comment'

export default router => {
  initComment(router),
  initClient(router)
}