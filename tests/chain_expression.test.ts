import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('chain expression tests', () => {
  testSafeEvalAgainstNative('const x = {y:true};x?.y');
  testSafeEvalAgainstNative('const x = undefined;x?.y');
  testSafeEvalAgainstNative('const x = null;x?.y');
});