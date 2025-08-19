import { SUGGESTIONS } from './suggestions';

const createSiteConfig = () => {
  return {
    title: 'Harpia',
    description:
      'Harpia é um assistente de IA que pode ajudar você a resolver seus problemas.',
    prompt: {
      onboarding: 'Como posso ajudar você hoje?',
      placeholder: 'Digite sua mensagem...',
      suggestions: SUGGESTIONS,
    },
  };
};

export const siteConfig = createSiteConfig();
