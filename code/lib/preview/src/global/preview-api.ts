/* eslint-disable no-underscore-dangle */
import type * as MODULE from '../preview-api';

const {
  DocsContext,
  Preview,
  PreviewWeb,
  composeConfigs,
  simulateDOMContentLoaded,
  simulatePageLoad,
  ClientApi,
  StoryStore,
  HooksContext,
  addArgTypes,
  addArgTypesEnhancer,
  addArgs,
  addArgsEnhancer,
  addDecorator,
  addLoader,
  addParameters,
  addStepRunner,
  addons,
  applyHooks,
  combineArgs,
  combineParameters,
  composeStepRunners,
  composeStories,
  composeStory,
  decorateStory,
  defaultDecorateStory,
  filterArgTypes,
  getQueryParam,
  getQueryParams,
  inferControls,
  normalizeStory,
  prepareStory,
  sanitizeStoryContextUpdate,
  setGlobalRender,
  setProjectAnnotations,
  sortStoriesV7,
  userOrAutoTitleFromSpecifier,
  makeDecorator,
  start,
  useArgs,
  useCallback,
  useChannel,
  useEffect,
  useGlobals,
  useMemo,
  useParameter,
  useReducer,
  useRef,
  useState,
  useStoryContext,
} = (globalThis as any).__STORYBOOK_MODULE_PREVIEW_API__ as typeof MODULE;

export {
  DocsContext,
  Preview,
  PreviewWeb,
  composeConfigs,
  simulateDOMContentLoaded,
  simulatePageLoad,
  ClientApi,
  StoryStore,
  HooksContext,
  addArgTypes,
  addArgTypesEnhancer,
  addArgs,
  addArgsEnhancer,
  addDecorator,
  addLoader,
  addParameters,
  addStepRunner,
  addons,
  applyHooks,
  combineArgs,
  combineParameters,
  composeStepRunners,
  composeStories,
  composeStory,
  decorateStory,
  defaultDecorateStory,
  filterArgTypes,
  getQueryParam,
  getQueryParams,
  inferControls,
  normalizeStory,
  prepareStory,
  sanitizeStoryContextUpdate,
  setGlobalRender,
  setProjectAnnotations,
  sortStoriesV7,
  userOrAutoTitleFromSpecifier,
  makeDecorator,
  start,
  useArgs,
  useCallback,
  useChannel,
  useEffect,
  useGlobals,
  useMemo,
  useParameter,
  useReducer,
  useRef,
  useState,
  useStoryContext,
};