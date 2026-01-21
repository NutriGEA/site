import type {UserConfig} from 'vite';
import htmlMinifier from 'vite-plugin-html-minifier';

export default {
  root: 'src',
  publicDir: import.meta.dirname + '/public',
  envDir: import.meta.dirname,
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
    },
  },
  plugins: [
    htmlMinifier(),
  ],
} satisfies UserConfig;
