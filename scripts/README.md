# B2 asset uploader

This repository uploads large image collections to the public Backblaze B2
bucket `sakanano` and serves them through the custom CDN domain
`img.sakanano.moe`.

The checked mapping is:

```text
local: src/assets/images/sky/2022-10-03.jpg
B2:    b2://sakanano/public/images/sky/2022-10-03.jpg
CDN:   https://img.sakanano.moe/file/sakanano/public/images/sky/2022-10-03.jpg
DNS:   img.sakanano.moe CNAME f005.backblazeb2.com
```

## Credentials

Never put an application key in this repository or a command-line argument.
Export it into the current shell instead:

```sh
export B2_KEY_ID="..."
export B2_APPLICATION_KEY="..."
```

For this dedicated local checkout, the uploader also reads `.env.b2.local`.
The file is ignored by Git and must have mode `0600`:

```text
B2_KEY_ID=...
B2_APPLICATION_KEY=...
B2_BUCKET_NAME=sakanano
B2_CDN_ORIGIN=https://img.sakanano.moe/file/sakanano
B2_CDN_CNAME=f005.backblazeb2.com
```

The application key should be restricted to the `sakanano` bucket and ideally
to the `public/images/sky/` name prefix. It needs `writeFiles`; add `listFiles`
so the uploader can skip objects whose SHA-1 already matches.

## Usage

Preview the complete local-to-CDN mapping without network access:

```sh
yarn assets:plan
```

Upload missing images, refuse different-content collisions, verify public CDN
URLs, and write the ignored `b2-upload-manifest.json` report:

```sh
yarn assets:upload
```

Use `--overwrite` only when intentionally creating new versions for objects
whose names already exist with different content:

```sh
yarn assets:upload --overwrite
```

For safety, an upload stops if the key lacks `listFiles`. The
`--allow-unchecked` escape hatch exists for a deliberately write-only key, but
it can create additional versions of every same-named object.

Run `node scripts/b2-upload-assets.mjs --help` for source, prefix, concurrency,
manifest, and CDN verification options. The uploader never deletes local or
remote files.

## Static slide bundle

The same uploader preserves every relative path in the standalone 2025 slide
export, including HTML, JavaScript, CSS, images, SVG, and WOFF files:

```sh
yarn slides:plan
yarn slides:upload
```

The resulting entry point is
`https://img.sakanano.moe/file/sakanano/public/slides/202503/index.html`.
