import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  newMessage: string;
  onMessageChange: (message: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
}

const ChatInput = ({ newMessage, onMessageChange, onSendMessage }: ChatInputProps) => {
  return (
    <form onSubmit={onSendMessage} className="p-4 border-t border-gaming-accent/20">
      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-gaming-dark/50 border-gaming-accent/20 text-white"
        />
        <Button type="submit" className="bg-gaming-accent hover:bg-gaming-accent/80">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;