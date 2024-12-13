import React from 'react';
import { Input } from "@/components/ui/input";

interface ProfileFormProps {
  username: string;
  gameId: string;
  isEditing: boolean;
  onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGameIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileForm = ({ 
  username, 
  gameId, 
  isEditing, 
  onUsernameChange, 
  onGameIdChange 
}: ProfileFormProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-gray-400">Username</label>
        {isEditing ? (
          <Input
            value={username}
            onChange={onUsernameChange}
            placeholder="Enter your username"
          />
        ) : (
          <p className="text-white">{username}</p>
        )}
      </div>

      <div>
        <label className="text-sm text-gray-400">Game ID</label>
        {isEditing ? (
          <Input
            value={gameId}
            onChange={onGameIdChange}
            placeholder="Enter your game ID"
          />
        ) : (
          <p className="text-white">{gameId || 'Not set'}</p>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;