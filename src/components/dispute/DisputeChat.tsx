import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSessionContext } from '@supabase/auth-helpers-react';

interface DisputeChatProps {
  disputeId: string;
}

const DisputeChat = ({ disputeId }: DisputeChatProps) => {
  const [message, setMessage] = useState('');
  const { session } = useSessionContext();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['dispute-messages', disputeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dispute_messages')
        .select(`
          *,
          sender:profiles(username)
        `)
        .eq('dispute_id', disputeId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const sendMessage = useMutation({
    mutationFn: async (newMessage: string) => {
      const { error } = await supabase
        .from('dispute_messages')
        .insert({
          dispute_id: disputeId,
          message: newMessage,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['dispute-messages', disputeId] });
    },
    onError: () => {
      toast.error('Failed to send message');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage.mutate(message.trim());
  };

  if (isLoading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div className="flex flex-col h-[400px]">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages?.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender_id === session?.user?.id ? 'items-end' : 'items-start'
              }`}
            >
              <div className={`max-w-[80%] rounded-lg p-3 ${
                msg.sender_id === session?.user?.id
                  ? 'bg-gaming-accent text-gaming-dark'
                  : 'bg-gaming-dark/50 text-white'
              }`}>
                <div className="text-sm font-semibold mb-1">
                  {msg.sender.username}
                </div>
                <div>{msg.message}</div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="p-4 border-t border-gaming-accent/20">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="bg-gaming-dark/50 border-gaming-accent/20 text-white"
          />
          <Button 
            type="submit"
            disabled={sendMessage.isPending}
            className="bg-gaming-accent hover:bg-gaming-accent/80"
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DisputeChat;