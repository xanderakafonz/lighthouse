/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

/* eslint-env mocha */

const CacheContentGather = require('../../../gather/gatherers/cache-contents');
const assert = require('assert');
let cacheContentGather;

const isExpectedOutput = artifact => {
  return 'raw' in artifact && 'value' in artifact;
};

describe('Cache Contents gatherer', () => {
  // Reset the Gatherer before each test.
  beforeEach(() => {
    cacheContentGather = new CacheContentGather();
  });

  it('fails gracefully', () => {
    return cacheContentGather.afterPass({
      driver: {
        evaluateAsync() {
          return Promise.resolve();
        }
      }
    }).then(_ => {
      assert.ok(typeof cacheContentGather.artifact === 'object');
    });
  });

  it('handles driver failure', () => {
    return cacheContentGather.afterPass({
      driver: {
        evaluateAsync() {
          return Promise.reject('such a fail');
        }
      }
    }).then(_ => {
      assert(false);
    }).catch(_ => {
      assert.ok(isExpectedOutput(cacheContentGather.artifact));
    });
  });

  it('propagates error retrieving the results', () => {
    const error = 'Unable to retrieve cache contents';
    return cacheContentGather.afterPass({
      driver: {
        evaluateAsync() {
          return Promise.reject(error);
        }
      }
    }).then(_ => {
      assert.ok(cacheContentGather.artifact.debugString === error);
    });
  });

  it('creates an object for valid results', () => {
    return cacheContentGather.afterPass({
      driver: {
        evaluateAsync() {
          return Promise.resolve(['a', 'b', 'c']);
        }
      }
    }).then(_ => {
      assert.ok(Array.isArray(cacheContentGather.artifact));
      assert.equal(cacheContentGather.artifact[0], 'a');
    });
  });
});
