import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCdnUrl,
  encodeB2FileName,
  isRetryableUploadError,
  normalizeObjectPrefix,
  validateCdnMapping,
} from "./b2-upload-assets.mjs";

test("normalizes safe B2 object prefixes", () => {
  assert.equal(normalizeObjectPrefix("/public/images/sky/"), "public/images/sky");
  assert.throws(() => normalizeObjectPrefix("../private"), /Invalid/);
});

test("encodes file names while preserving virtual directories", () => {
  assert.equal(
    encodeB2FileName("public/images/天空 01.jpg"),
    "public/images/%E5%A4%A9%E7%A9%BA%2001.jpg"
  );
});

test("builds the expected custom CDN URL", () => {
  assert.equal(
    buildCdnUrl(
      "https://img.sakanano.moe/file/sakanano",
      "public/images/sky/2022-10-03.jpg"
    ),
    "https://img.sakanano.moe/file/sakanano/public/images/sky/2022-10-03.jpg"
  );
});

test("validates bucket path and Backblaze download host", () => {
  assert.equal(
    validateCdnMapping({
      bucketName: "sakanano",
      cdnBaseUrl: "https://img.sakanano.moe/file/sakanano",
      cdnCnameTarget: "f005.backblazeb2.com",
      b2DownloadUrl: "https://f005.backblazeb2.com",
    }),
    "https://img.sakanano.moe/file/sakanano"
  );
  assert.throws(
    () =>
      validateCdnMapping({
        bucketName: "another-bucket",
        cdnBaseUrl: "https://img.sakanano.moe/file/sakanano",
      }),
    /CDN path must be \/file\/another-bucket/
  );
  assert.throws(
    () =>
      validateCdnMapping({
        bucketName: "sakanano",
        cdnBaseUrl: "https://img.sakanano.moe/file/sakanano",
        cdnCnameTarget: "f005.backblazeb2.com",
        b2DownloadUrl: "https://f004.backblazeb2.com",
      }),
    /CNAME target mismatch/
  );
});

test("retries transient fetch and B2 service failures", () => {
  assert.equal(isRetryableUploadError(new TypeError("fetch failed")), true);
  assert.equal(isRetryableUploadError({ status: 503 }), true);
  assert.equal(isRetryableUploadError({ code: "expired_auth_token" }), true);
  assert.equal(isRetryableUploadError({ status: 400 }), false);
});
