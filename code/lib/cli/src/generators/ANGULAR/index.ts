import { join } from 'path';
import semver from 'semver';
import fs from 'fs';
import dedent from 'ts-dedent';
import { baseGenerator } from '../baseGenerator';
import type { Generator } from '../types';
import { CoreBuilder } from '../../project_types';
import { AngularJSON, compoDocPreviewPrefix, promptForCompoDocs } from './helpers';
import { getCliDir } from '../../dirs';
import { copyTemplate } from '../../helpers';
import { isStorybookInstalled } from '../../detect';

const generator: Generator<{ projectName: string }> = async (
  packageManager,
  npmOptions,
  options,
  commandOptions
) => {
  const packageJson = packageManager.retrievePackageJson();
  const angularVersion = semver.coerce(packageJson.dependencies['@angular/core'])?.version;
  const isWebpack5 = semver.gte(angularVersion, '12.0.0');
  const updatedOptions = isWebpack5 ? { ...options, builder: CoreBuilder.Webpack5 } : options;

  const angularJSON = new AngularJSON();
  const angularProjectName = await angularJSON.getProjectName();
  const { root } = angularJSON.getProjectSettingsByName(angularProjectName);
  const { projects } = angularJSON;
  const useCompodoc = commandOptions.yes ? true : await promptForCompoDocs();
  const storybookFolder = root ? `${root}/.storybook` : '.storybook';

  if (root !== '') {
    // create a .storybook folder in the root of the Angular project
    fs.mkdirSync(storybookFolder, { recursive: true });
    const rootReferencePathFromStorybookFolder = root
      .split('/')
      .map(() => '../')
      .join('');

    fs.writeFileSync(
      `${storybookFolder}/main.js`,
      dedent(`
        const mainRoot = require('${rootReferencePathFromStorybookFolder}../.storybook/main.js');
        module.exports = {
          ...mainRoot
        };
      `)
    );

    fs.writeFileSync(
      `${storybookFolder}/tsconfig.json`,
      dedent(`
        {
          "extends": "${rootReferencePathFromStorybookFolder}../.storybook/tsconfig.json",
          "exclude": ["../src/test.ts", "../src/**/*.spec.ts"],
          "include": ["../src/**/*"]
        }
      `)
    );
  }

  angularJSON.addStorybookEntries({
    angularProjectName,
    storybookFolder,
    useCompodoc,
    root,
  });
  angularJSON.write();

  const isSbInstalled = isStorybookInstalled(packageJson, commandOptions.force);

  await baseGenerator(
    packageManager,
    npmOptions,
    {
      ...updatedOptions,
      ...(useCompodoc && {
        frameworkPreviewParts: {
          prefix: compoDocPreviewPrefix,
        },
      }),
    },
    'angular',
    {
      ...(useCompodoc && { extraPackages: ['@compodoc/compodoc'] }),
      addScripts: false,
      addComponents: !isSbInstalled,
      addMainFile: !isSbInstalled,
      storybookConfigFolder: storybookFolder,
    },
    'angular'
  );

  if (Object.keys(projects).length === 1) {
    packageManager.addScripts({
      storybook: `ng run ${angularProjectName}:storybook`,
      'build-storybook': `ng run ${angularProjectName}:build-storybook`,
    });
  }

  const templateDir = join(getCliDir(), 'templates', 'angular');
  copyTemplate(templateDir);

  return {
    projectName: angularProjectName,
  };
};

export default generator;
