import type {UserConfig} from 'vite';

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
} satisfies UserConfig;
