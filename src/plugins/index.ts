/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import { loadFonts } from './webfontloader'
import vuetify from './vuetify'
import firebase from './firebase'
import pinia from '../store'
import router from '../router'

import * as message from '../composable/message'

// Types
import type { App } from 'vue'

export function registerPlugins (app: App) {
  app.provide('message',message)
  loadFonts()
  firebase
  app.use(vuetify).use(router).use(pinia)
}
