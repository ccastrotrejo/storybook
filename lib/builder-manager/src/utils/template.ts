import path, { dirname, join } from 'path';
import { readFile, pathExists } from 'fs-extra';

import { render } from 'ejs';

import type { Ref } from '@storybook/core-common';

import { readDeep } from './directory';

const interpolate = (string: string, data: Record<string, string> = {}) =>
  Object.entries(data).reduce((acc, [k, v]) => acc.replace(new RegExp(`%${k}%`, 'g'), v), string);

export const getTemplatePath = async (template: string) => {
  return join(
    dirname(require.resolve('@storybook/builder-manager/package.json')),
    'templates',
    template
  );
};

export const readTemplate = async (template: string) => {
  const path = await getTemplatePath(template);

  return readFile(path, 'utf8');
};

export async function getManagerHeadTemplate(
  configDirPath: string,
  interpolations: Record<string, string>
) {
  const head = await pathExists(path.resolve(configDirPath, 'manager-head.html')).then<
    Promise<string> | false
  >((exists) => {
    if (exists) {
      return readFile(path.resolve(configDirPath, 'manager-head.html'), 'utf8');
    }
    return false;
  });

  if (!head) {
    return '';
  }

  return interpolate(head, interpolations);
}

export async function getManagerMainTemplate() {
  return getTemplatePath(`manager.ejs`);
}

export const renderHTML = async (
  template: Promise<string>,
  title: Promise<string | false>,
  customHead: Promise<string | false>,
  files: ReturnType<typeof readDeep>,
  features: Promise<Record<string, any>>,
  refs: Promise<Record<string, Ref>>,
  logLevel: Promise<string>
) => {
  const customHeadRef = await customHead;
  const titleRef = await title;
  const templateRef = await template;
  const filesRef = await files;

  return render(templateRef, {
    title: titleRef ? `${titleRef} - Storybook` : 'Storybook',
    files: {
      js: filesRef.filter((f) => f.path.match(/\.mjs$/)).map((f) => `./sb-addons/${f.path}`),
      css: filesRef.filter((f) => f.path.match(/\.css$/)).map((f) => `./sb-addons/${f.path}`),
    },
    globals: {
      FEATURES: JSON.stringify(await features, null, 2),
      REFS: JSON.stringify(await refs, null, 2),
      LOGLEVEL: JSON.stringify(await logLevel, null, 2),
    },
    head: customHeadRef ? await readFile(customHeadRef, 'utf8') : '',
  });
};