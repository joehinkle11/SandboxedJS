import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('eval tests', () => {
  testSafeEvalAgainstNative('eval("1")');
});