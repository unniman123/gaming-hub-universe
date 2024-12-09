import React, { useState, useEffect, useRef } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Message {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
  is_system_message: boolean;
  profiles?: {
    username: string;
  };
}

interface MatchChatProps {
  matchId: string;
  player1Username: string;
  player2Username: string;
}

const MatchChat = ({ matchId, player1Username, player2Username }: MatchChatProps) => {
  const { session } = useSessionContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch existing messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('match_chat')
        .select('*, profiles(username)')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data || []);
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`match_chat:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'match_chat',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase.from('match_chat').insert({
        match_id: matchId,
        sender_id: session?.user?.id,
        message: newMessage.trim(),
      });

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="flex flex-col h-[400px] bg-gaming-dark/50 border border-gaming-accent/20 rounded-lg">
      <div className="p-4 border-b border-gaming-accent/20">
        <h3 className="text-lg font-semibold text-white">Match Chat</h3>
        <p className="text-sm text-gray-400">{player1Username} vs {player2Username}</p>
      </div>
      
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${
                message.sender_id === session?.user?.id ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.is_system_message
                    ? 'bg-gray-500/20 text-gray-300'
                    : message.sender_id === session?.user?.id
                    ? 'bg-gaming-accent text-white'
                    : 'bg-gray-700 text-white'
                }`}
              >
                {!message.is_system_message && (
                  <p className="text-xs opacity-75 mb-1">
                    {message.profiles?.username || 'Unknown User'}
                  </p>
                )}
                <p>{message.message}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gaming-accent/20">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gaming-dark/50 border-gaming-accent/20 text-white"
          />
          <Button type="submit" className="bg-gaming-accent hover:bg-gaming-accent/80">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MatchChat;