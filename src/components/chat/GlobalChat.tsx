import React, { useState, useEffect } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ChatUserList from './ChatUserList';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';

const GlobalChat = () => {
  const { session } = useSessionContext();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!session?.user?.id || !selectedUser) return;

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
          setMessages((prev) => [...prev, payload.new]);
          toast.info('New message received!');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, selectedUser]);

  useEffect(() => {
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
        const presenceUsers = Object.values(newState).flat();
        setOnlineUsers(presenceUsers);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && session?.user?.id) {
          await channel.track({
            id: session.user.id,
            username: session.user.email,
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

  const handleSelectUser = (userId: string) => {
    setSelectedUser(userId);
    setSearchQuery('');
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

          {selectedUser ? (
            <>
              <ChatMessages 
                messages={messages} 
                currentUserId={session?.user?.id} 
              />
              <ChatInput
                newMessage={newMessage}
                onMessageChange={setNewMessage}
                onSendMessage={handleSendMessage}
              />
            </>
          ) : (
            <ChatUserList
              users={onlineUsers}
              onSelectUser={handleSelectUser}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
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