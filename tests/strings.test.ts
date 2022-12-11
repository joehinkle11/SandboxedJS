import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('basic strings', () => {
  testSafeEvalAgainstNative('""');
  testSafeEvalAgainstNative('"hello world"');
  testSafeEvalAgainstNative('"🤯emoji⏰time😂"');
  testSafeEvalAgainstNative("''");
  testSafeEvalAgainstNative("'hello world'");
  testSafeEvalAgainstNative("'🤯emoji⏰time😂'");
});

describe('strings with simple quotes', () => {
  testSafeEvalAgainstNative(`"'"`);
  testSafeEvalAgainstNative(`'"'`);
  testSafeEvalAgainstNative('"`"');
});

describe('strings with newlines and tabs', () => {
  testSafeEvalAgainstNative('"\\n"');
  testSafeEvalAgainstNative('"\\n\\n\\n\\n"');
  testSafeEvalAgainstNative('"a \\nb \\n d \\n df\\n df"');
  testSafeEvalAgainstNative('"\\t"');
  testSafeEvalAgainstNative('"\\tf\\ts"');
  testSafeEvalAgainstNative('"a \\nb \\n \\nd \\n df\\n df"');
});