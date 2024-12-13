import React from 'react';
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileActionsProps {
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

const ProfileActions = ({ isEditing, onEdit, onSave, onCancel }: ProfileActionsProps) => {
  if (!isEditing) {
    return (
      <Button variant="outline" onClick={onEdit}>
        <Pencil className="w-4 h-4 mr-2" />
        Edit Profile
      </Button>
    );
  }

  return (
    <div className="flex space-x-4">
      <Button onClick={onSave}>Save Changes</Button>
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
};

export default ProfileActions;