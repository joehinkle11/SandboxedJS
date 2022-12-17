import {describe} from '@jest/globals';
import { testSafeEvalAgainstNative } from './helpers';

describe('garbage collection tests', () => {
  testSafeEvalAgainstNative("'todo'")
  // testSafeEvalAgainstNative(`
  //   new Promise((resolve) => {
  //     let insideScoped, outsideScoped;
  //     function scoped() {
  //       const o = {};
  //       const wr = new WeakRef(o);
  //       insideScoped = wr.deref().toString();
  //       return wr;
  //     }
  //     const wr = scoped();
  //     let maxAttemptsWaitingForGC = 30;
  //     function attempt() {
  //       globalThis.gc()
  //       outsideScoped = wr.deref()?.toString();
  //       if (outsideScoped === undefined) {
  //         return resolve([insideScoped, outsideScoped])
  //       }
  //       maxAttemptsWaitingForGC -= 1;
  //       if (maxAttemptsWaitingForGC > 0) {
  //         console.log("failed " + maxAttemptsWaitingForGC);
  //         setTimeout(attempt, 100);
  //       } else {
  //         return resolve([insideScoped, outsideScoped])
  //       }
  //     }
  //     attempt();
  //   });
  // `);
});
