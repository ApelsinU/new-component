#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const { program } = require('commander');

const {
  getConfig,
  buildPrettifier,
  createParentDirectoryIfNecessary,
  logIntro,
  logItemCompletion,
  logConclusion,
  logError,
  splitNameByStyle
} = require('./helpers');
const {
  requireOptional,
  mkDirPromise,
  readFilePromiseRelative,
  writeFilePromise,
} = require('./utils');

// Load our package.json, so that we can pass the version onto `commander`.
const { version } = require('../package.json');

// Get the default config for this component (looks for local/global overrides,
// falls back to sensible defaults).
const config = getConfig();

// Convenience wrapper around Prettier, so that config doesn't have to be
// passed every time.
const prettify = buildPrettifier(config.prettierConfig);

program
  .version(version)
  .arguments('<componentName>')
  .option(
    '-l, --lang <language>',
    'Which language to use (default: "js")',
    /^(js|ts|jsx|tsx)$/i,
    config.lang
  )
  .option(
      '-s, --style <language>',
      'Which language to use in Css (default: "SCSS")',
      /^(styl|scss)$/i,
      config.style
  )
  .option(
      '-cm, --css-module <cssModule>',
      'Is css module enabled',
      /^(true|false)$/i,
      config.cssModule
  )
  .option(
    '-d, --dir <pathToDirectory>',
    'Path to the "components" directory (default: "src/components")',
    config.dir
  )
  .option(
    '-dns, --dir-name-style <styleOfDirectoryName>',
    'Style of the "components" directory name (default: "upperCamelCase")',
    config.dirNameStyle
  )
  .option(
    '-ccn, --css-classes-name <cssClassesName>',
    'Config how to write classes in jsx/html : className or styleName (default: "className")',
    config.cssClassesName
  )
  // todo: index file is temporary disabled - need to add option in config to switch it
  // .action(
  //     '-i, --index <indexFile>',
  //     'Disable/Enable index file',
  //     config.index
  // )
  .parse(process.argv);

const [componentName] = program.args;

const options = program.opts();

const fileExtension = options.lang // 'js' | 'ts | 'jsx' | 'tsx' ;

// const indexExtension = options.lang === 'js' ? 'js' : 'ts';
const styleExtension = options.style // 'styl' | 'scss';

// Find the path to the selected template file.
const templatePath = `./templates/${options.lang}.js`;

// Get all of our file paths worked out, for the user's project.
const componentDir = `${options.dir}/${splitNameByStyle(componentName, config.dirNameStyle)}`;
const filePath = `${componentDir}/${componentName}.${fileExtension}`;
// const indexPath = `${componentDir}/index.${indexExtension}`;
const cssModulePrefix = config.cssModule ? 'module.' : ''
const stylePath = `${componentDir}/${splitNameByStyle(componentName, 'kebabCase')}.${cssModulePrefix}${styleExtension}`;

// Our index template is super straightforward, so we'll just inline it for now.
// const indexTemplate = prettify(`\
// export * from './${componentName}';
// export { default } from './${componentName}';
// `);

const styleTemplate = ``;

logIntro({
  name: componentName,
  dir: componentDir,
  lang: options.lang,
});

// Check if componentName is provided
if (!componentName) {
  logError(
    `Sorry, you need to specify a name for your component like this: new-component <name>`
  );
  process.exit(0);
}

// Check to see if the parent directory exists.
// Create it if not
createParentDirectoryIfNecessary(options.dir);

// Check to see if this component has already been created
const fullPathToComponentDir = path.resolve(componentDir);
if (fs.existsSync(fullPathToComponentDir)) {
  logError(
    `Looks like this component already exists! There's already a component at ${componentDir}.\nPlease delete this directory and try again.`
  );
  process.exit(0);
}

// Start by creating the directory that our component lives in.
mkDirPromise(componentDir)
  .then(() => readFilePromiseRelative(templatePath))
  .then((template) => {
    logItemCompletion('Directory created.');
    return template;
  })
  .then((template) =>
    // Replace our placeholders with real data (so far, just the component name)
    template.replace(/COMPONENT_NAME/g, componentName)
  )
  .then((template) =>
    // Replace our placeholders with real data (so far, just the component name)
    template.replace(/STYLE_NAME/g, splitNameByStyle(componentName, 'kebabCase'))
  )
  .then((template) =>
    // Replace our placeholders with real data (so far, just the component name)
    template.replace(/STYLE_EXT/g, cssModulePrefix + config.style)
  )
  .then((template) =>
    // Replace our placeholders with real data (so far, just the component name)
    template.replace(/CLASS_NAME/g, config.cssClassesName)
  )
  .then((template) =>
    // Format it using prettier, to ensure style consistency, and write to file.
    writeFilePromise(filePath, template)
    //writeFilePromise(filePath, prettify(template))
  )
  .then((template) => {
    logItemCompletion('Component built and saved to disk.');
    return template;
  })
  .then((template) =>
    writeFilePromise(stylePath, styleTemplate)
  )
  .then((template) => {
    logItemCompletion('Index file built and saved to disk.');
    return template;
  })
  .then((template) => {
    logConclusion();
  })
  .catch((err) => {
    console.error(err);
  });
