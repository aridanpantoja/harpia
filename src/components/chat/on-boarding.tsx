import type { useChat } from '@ai-sdk/react';
import { siteConfig } from '@/config/site';
import { Suggestion } from '../ai-elements/suggestion';

type OnBoardingProps = {
  onSendMessage: ReturnType<typeof useChat>['sendMessage'];
};

export function OnBoarding({ onSendMessage }: OnBoardingProps) {
  function handleSendMessage(suggestion: string) {
    onSendMessage({ text: suggestion });
  }

  return (
    <div className="flex h-full w-full flex-1 flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="font-bold text-3xl">{siteConfig.prompt.onboarding}</h1>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {siteConfig.prompt.suggestions.map((suggestion) => (
            <Suggestion
              key={suggestion.title}
              onClick={() => handleSendMessage(suggestion.title)}
              suggestion={suggestion.title}
            >
              <suggestion.Icon className="text-primary" />
              <span>{suggestion.shortTitle}</span>
            </Suggestion>
          ))}
        </div>
      </div>
    </div>
  );
}
