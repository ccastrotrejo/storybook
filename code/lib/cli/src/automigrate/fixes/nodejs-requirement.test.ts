/// <reference types="@types/jest" />;

import type { JsPackageManager } from '../../js-package-manager';
import { nodeJsRequirement } from './nodejs-requirement';

// eslint-disable-next-line global-require, jest/no-mocks-import
jest.mock('fs-extra', () => require('../../../../../__mocks__/fs-extra'));

const check = async ({ packageJson = {} }: any) => {
  const packageManager = {
    retrievePackageJson: () => ({
      dependencies: {
        '@storybook/react': '^7.0.0',
      },
      devDependencies: {},
      ...packageJson,
    }),
  } as JsPackageManager;
  return nodeJsRequirement.check({ packageManager });
};

const originalNodeVersion = process.version;
const mockNodeVersion = (version: string) => {
  Object.defineProperties(process, {
    version: {
      value: version,
    },
  });
};

describe('nodejs-requirement fix', () => {
  afterAll(() => {
    mockNodeVersion(originalNodeVersion);
  });

  it('skips when node >= 16.0.0', async () => {
    mockNodeVersion('16.0.0');
    await expect(check({})).resolves.toBeNull();
  });

  it('prompts when node <= 16.0.0', async () => {
    mockNodeVersion('14.0.0');
    await expect(check({})).resolves.toEqual({ nodeVersion: '14.0.0' });
  });
});
