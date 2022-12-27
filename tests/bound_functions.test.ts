import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('bound functions', () => {
  testSafeEvalAgainstNative(`
    const B = function() {};
    const bound1 = B.bind(null);
    const bound2 = bound1.bind(null);
    [B.name, bound1.name, bound2.name];
  `);
});
