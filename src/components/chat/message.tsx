'use client';

import type { UIMessage } from 'ai';
import { AnimatePresence, motion } from 'motion/react';
import {
  Message as AiMessage,
  MessageContent,
} from '@/components/ai-elements/message';
import { Response } from '../ai-elements/response';
import { CopyButton } from './copy-button';
import { DownvoteButton } from './downvote-button';
import { UpvoteButton } from './upvote-button';

interface MessageProps {
  message: UIMessage;
}

export function Message({ message }: MessageProps) {
  return (
    <AnimatePresence>
      <motion.div
        animate={{ y: 0, opacity: 1 }}
        className="w-full"
        data-role={message.role}
        data-testid={`message-${message.role}`}
        exit={{ y: 5, opacity: 0 }}
        initial={{ y: 5, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <AiMessage
          className="flex flex-col "
          from={message.role}
          key={message.id}
        >
          <MessageContent>
            {message.parts.map((part, i) => {
              switch (part.type) {
                case 'text':
                  return (
                    <Response key={`${message.id}-${i}`}>{part.text}</Response>
                  );
                default:
                  return null;
              }
            })}
          </MessageContent>
          {message.role === 'assistant' && (
            <div className="flex justify-end gap-2">
              <CopyButton message={message} />
              <UpvoteButton chatId={chatId} messageId={message.id} />
              <DownvoteButton chatId={chatId} messageId={message.id} />
            </div>
          )}
        </AiMessage>
      </motion.div>
    </AnimatePresence>
  );
}
