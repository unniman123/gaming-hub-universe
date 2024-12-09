import React, { useState, useEffect, useRef } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  profiles?: {
    username: string;
    avatar_url: string;
  };
}

const GlobalChat = () => {
  const { session } = useSessionContext();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session?.user?.id || !selectedUser) return;

    // Fetch existing messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*, profiles(username, avatar_url)')
        .or(`and(sender_id.eq.${session.user.id},receiver_id.eq.${selectedUser}),and(sender_id.eq.${selectedUser},receiver_id.eq.${session.user.id})`)
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
      .channel(`direct_messages:${session.user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `receiver_id=eq.${session.user.id}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
          toast.info('New message received!');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, selectedUser]);

  useEffect(() => {
    // Track user presence
    const channel = supabase.channel('online_users', {
      config: {
        presence: {
          key: session?.user?.id,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        setOnlineUsers(Object.values(newState));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && session?.user?.id) {
          await channel.track({
            user_id: session.user.id,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [session?.user?.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      const { error } = await supabase.from('direct_messages').insert({
        sender_id: session?.user?.id,
        receiver_id: selectedUser,
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
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-gaming-dark border border-gaming-accent/20 rounded-lg w-80 h-96 flex flex-col">
          <div className="p-4 border-b border-gaming-accent/20 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Chat</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            {selectedUser ? (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender_id === session?.user?.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.sender_id === session?.user?.id
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
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {onlineUsers.map((user: any) => (
                  <Button
                    key={user.user_id}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setSelectedUser(user.user_id)}
                  >
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={user.avatar_url} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <span className="flex-1 text-left">{user.username}</span>
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                  </Button>
                ))}
              </div>
            )}
          </ScrollArea>

          {selectedUser && (
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
          )}
        </div>
      ) : (
        <Button
          className="bg-gaming-accent hover:bg-gaming-accent/80"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Chat
        </Button>
      )}
    </div>
  );
};

export default GlobalChat;