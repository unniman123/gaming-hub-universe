import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
  profiles?: {
    username: string;
    avatar_url: string;
  };
}

interface ChatMessagesProps {
  messages: Message[];
  currentUserId: string;
}

const ChatMessages = ({ messages, currentUserId }: ChatMessagesProps) => {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender_id === currentUserId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div className="flex items-start max-w-[80%] space-x-2">
              {message.sender_id !== currentUserId && (
                <Avatar className="h-6 w-6">
                  <AvatarImage src={message.profiles?.avatar_url} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`rounded-lg p-3 ${
                  message.sender_id === currentUserId
                    ? 'bg-gaming-accent text-white'
                    : 'bg-gray-700 text-white'
                }`}
              >
                <p className="text-xs opacity-75 mb-1">
                  {message.profiles?.username || 'Unknown User'}
                </p>
                <p>{message.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ChatMessages;