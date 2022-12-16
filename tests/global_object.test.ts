import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('global Object tests', () => {
  testSafeEvalAgainstNative("Object.name");
});