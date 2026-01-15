import {brotliCompressSync, gzipSync, zstdCompressSync, constants} from 'node:zlib';
import {writeFileSync} from 'node:fs';
import {extname} from 'node:path';

import type {Plugin, UserConfig} from 'vite';

type Compressor = (content: Uint8Array) => Uint8Array;

const compressBr: Compressor = content => brotliCompressSync(content, {
  params: {[constants.BROTLI_PARAM_QUALITY]: constants.BROTLI_MAX_QUALITY},
});

const compressGz: Compressor = content => gzipSync(content, {level: 9});

const compressZstd: Compressor = content => zstdCompressSync(content, {
  params: {[constants.ZSTD_c_compressionLevel]: 22},
});

const precompress: Plugin = {
  name: 'precompress',
  apply: 'build',

  async writeBundle(outputOptions, bundle) {
    const outDir = (outputOptions.dir ?? '.') + '/';
    const encoder = new TextEncoder();

    const compress = (fileName: string, content: Uint8Array, fn: Compressor): void => {
      const compressed = fn(content);
      if (compressed.length < content.length) {
        this.emitFile({type: 'asset', fileName, source: compressed});
        writeFileSync(outDir + fileName, compressed);
      }
    };

    const extensions = new Set(['.html', '.css', '.js', '.svg']);

    for (const item of Object.values(bundle)) {
      const fileName = item.fileName;
      const ext = extname(fileName);
      let content = item.type === 'asset' ? item.source : item.code;

      if (!content.length || !extensions.has(ext)) {
        continue;
      }

      if (typeof content === 'string') {
        content = encoder.encode(content);
      }

      compress(fileName + '.gz', content, compressGz);
      compress(fileName + '.br', content, compressBr);
      compress(fileName + '.zst', content, compressZstd);
    }
  },
};

export default {
  root: 'src',
  publicDir: import.meta.dirname + '/public',
  envDir: import.meta.dirname,
  plugins: [precompress],
  build: {
    emptyOutDir: true,
    outDir: import.meta.dirname + '/dist',
    rolldownOptions: {
      input: {
        index: 'index.html',
        offer: 'offer.html',
        pdPolicy: 'personal-data-policy.html',
        privacyConsent: 'privacy-consent.html',
      },
      output: {
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
} satisfies UserConfig;
