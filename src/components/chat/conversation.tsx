'use client';

import type { UIMessage } from 'ai';
import { ArrowDown } from 'lucide-react';
import { motion } from 'motion/react';
import { useScrollToBottom } from '@/hooks/use-scroll-to-bottom';
import { useVotes } from '@/hooks/use-votes';
import { Message, MessageContent } from '../ai-elements/message';
import { Response } from '../ai-elements/response';
import { TooltipButton } from '../common/tooltip-button';
import { MessageActions } from './message-actions';

type ConversationProps = {
  chatId: string;
  messages: UIMessage[];
};

export function Conversation({ chatId, messages }: ConversationProps) {
  const {
    messagesEndRef,
    showScrollButton,
    handleScroll,
    setShowScrollButton,
  } = useScrollToBottom();

  const { data: votes } = useVotes({ chatId });

  return (
    <div className="relative flex h-full w-full flex-col items-center">
      <div className="relative w-full">
        <div className="flex w-full flex-col items-center">
          {messages.map((message) => (
            <Message
              className="flex flex-col "
              from={message.role}
              key={message.id}
            >
              <MessageContent>
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    case 'text':
                      return (
                        <Response key={`${message.id}-${i}`}>
                          {part.text}
                        </Response>
                      );
                    default:
                      return null;
                  }
                })}
              </MessageContent>
              <MessageActions
                chatId={chatId}
                message={message}
                vote={votes?.find((item) => item.messageId === message.id)}
              />
            </Message>
          ))}

          {showScrollButton && (
            <div className="fixed bottom-40 z-50 flex items-center justify-center">
              <TooltipButton
                content="Ir para o final"
                onClick={handleScroll}
                variant="default"
              >
                <ArrowDown />
              </TooltipButton>
            </div>
          )}
        </div>

        <motion.div
          className="mt-24"
          onViewportEnter={() => setShowScrollButton(false)}
          onViewportLeave={() => setShowScrollButton(true)}
          ref={messagesEndRef}
        />
      </div>
    </div>
  );
}
