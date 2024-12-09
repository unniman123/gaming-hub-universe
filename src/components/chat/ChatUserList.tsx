import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatUserListProps {
  users: any[];
  onSelectUser: (userId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const ChatUserList = ({ users, onSelectUser, searchQuery, onSearchChange }: ChatUserListProps) => {
  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.game_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Input
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by username or game ID..."
        className="bg-gaming-dark/50 border-gaming-accent/20 text-white"
      />
      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {filteredUsers.map((user: any) => (
            <Button
              key={user.user_id}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => onSelectUser(user.user_id)}
            >
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm">{user.username}</span>
                {user.game_id && (
                  <span className="text-xs text-gray-400">Game ID: {user.game_id}</span>
                )}
              </div>
              <div className="ml-auto flex items-center space-x-2">
                <div className={`h-2 w-2 rounded-full ${user.is_online ? 'bg-green-500' : 'bg-gray-500'}`} />
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatUserList;