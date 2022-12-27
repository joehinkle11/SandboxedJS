import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('object prototype tests', () => {
  testSafeEvalAgainstNative(`typeof Object.prototype`);
  testSafeEvalAgainstNative(`typeof Object.prototype.toString`);
  testSafeEvalAgainstNative(`typeof Object.prototype.bind`);
});