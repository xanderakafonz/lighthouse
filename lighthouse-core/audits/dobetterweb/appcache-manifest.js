/**
 * @license
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

const Audit = require('../audit');
const Formatter = require('../../formatters/formatter');

class AppCacheManifestAttr extends Audit {

  /**
   * @return {!AuditMeta}
   */
  static get meta() {
    return {
      category: 'Offline',
      name: 'appcache-manifest',
      description: 'Site is not using Application Cache',
      requiredArtifacts: ['AppCacheManifest']
    };
  }

  /**
   * @param {!Artifacts} artifacts
   * @return {!AuditResult}
   */
  static audit(artifacts) {
    if (typeof artifacts.AppCacheManifest === 'undefined' ||
        artifacts.AppCacheManifest === -1) {
      return AppCacheManifestAttr.generateAuditResult({
        rawValue: false,
        debugString: 'Unable to determine if you\'re using AppCache.'
      });
    }

    const usingAppcache = artifacts.AppCacheManifest !== null;
    const displayValue = usingAppcache ? `<html manifest="${artifacts.AppCacheManifest}">` : '';

    const extendedInfo = {
      help: "Application Cache is <a href='https://html.spec.whatwg.org/multipage/browsers.html#offline' target='_blank'>deprecated</a> by <a href='https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers' target='_blank'>Service Workers</a>. Consider implementing an offline solution using the <a href='https://developer.mozilla.org/en-US/docs/Web/API/Cache' target='blank'>Cache Storage API</a>."
    };

    return AppCacheManifestAttr.generateAuditResult({
      rawValue: !usingAppcache,
      displayValue: displayValue,
      extendedInfo: {
        formatter: Formatter.SUPPORTED_FORMATS.DOBETTERWEB,
        value: extendedInfo
      }
    });
  }
}

module.exports = AppCacheManifestAttr;
