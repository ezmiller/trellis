"use strict"
import Jed from 'jed'
import po2json from 'po2json'

let jedInitJson = {}
if (window.PRELOAD && window.PRELOAD.TRANSLATIONS)
  jedInitJson = po2json.parse(window.PRELOAD.TRANSLATIONS, {format: 'jed1.x'})

// Initialize Jed with translation data passed from server.
// If the translations object is somehow not passed, Jed is
// initalized with an empty object with the result that the
// keys will be passed through directly, i.e. the default of
// English will be used.
// Jed docs: https://slexaxton.github.io/Jed/
var i18n = new Jed(jedInitJson)

export default i18n
