
// This configuration file is copied from the `React-Invenio-Deposit`.

const { languages } = require('./package').config;

// list of func used to
// mark the strings for translation
const funcList = ['i18next.t'];

// list of extension to look for
const extensions = ['.js', '.jsx'];

module.exports = {
  options: {
    debug: true,
    removeUnusedKeys: true,
    browserLanguageDetection: true,
    func: {
      list: funcList,
      extensions: extensions,
    },
    //using Trans component
    trans: {
      component: 'Trans',
      extensions: extensions,
      fallbackKey: function (ns, value) {
        return value;
      },
    },
    lngs: languages,
    ns: [
      // file name (.json)
      'translations',
    ],
    defaultLng: 'en',
    defaultNs: 'translations',
    // @param {string} lng The language currently used.
    // @param {string} ns The namespace currently used.
    // @param {string} key The translation key.
    // @return {string} Returns a default value for the translation key.
    defaultValue: function (lng, ns, key) {
      if (lng === 'en') {
        // Return key as the default value for English language
        return key;
      }
      return '';
    },
    resource: {
      // The path where resources get loaded from. Relative to current working directory.
      loadPath: 'src/lib/translations/messages/{{lng}}/{{ns}}.json',

      // The path to store resources.
      savePath: 'src/lib/translations/messages/{{lng}}/{{ns}}.json',

      jsonIndent: 2,
      lineEnding: '\n',
    },
    nsSeparator: false, // namespace separator

    //Set to false to disable key separator
    // if you prefer having keys as the fallback for translation (e.g. gettext).
    keySeparator: false,
  },
};