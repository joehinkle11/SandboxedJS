import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('number wrapper tests', () => {
  testSafeEvalAgainstNative("new Number(1)");
});