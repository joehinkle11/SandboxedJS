import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('autoboxing tests', () => {
  testSafeEvalAgainstNative("[[1]:true]");
});