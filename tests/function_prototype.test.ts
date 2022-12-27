import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('function prototype tests', () => {
  testSafeEvalAgainstNative(`
    const o = function() {};
    o.prototype;
  `);
});