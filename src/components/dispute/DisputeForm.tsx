import React from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSessionContext } from '@supabase/auth-helpers-react';

interface DisputeFormProps {
  matchId: string;
  againstId: string;
  onDisputeCreated: () => void;
}

interface DisputeFormData {
  title: string;
  description: string;
  type: string;
}

const DisputeForm = ({ matchId, againstId, onDisputeCreated }: DisputeFormProps) => {
  const { register, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm<DisputeFormData>();
  const { session } = useSessionContext();

  const onSubmit = async (data: DisputeFormData) => {
    try {
      if (!session?.user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('dispute_cases')
        .insert({
          match_id: matchId,
          against_id: againstId,
          reported_by_id: session.user.id,
          title: data.title,
          description: data.description,
          status: 'pending',
        });

      if (error) throw error;

      toast.success('Dispute submitted successfully');
      reset();
      onDisputeCreated();
    } catch (error) {
      console.error('Error submitting dispute:', error);
      toast.error('Failed to submit dispute');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          {...register('title', { required: true })}
          placeholder="Dispute Title"
          className="bg-gaming-dark/50 border-gaming-accent/20 text-white"
        />
      </div>
      <div>
        <Select onValueChange={(value) => setValue('type', value)}>
          <SelectTrigger className="bg-gaming-dark/50 border-gaming-accent/20 text-white">
            <SelectValue placeholder="Select dispute type" />
          </SelectTrigger>
          <SelectContent className="bg-gaming-dark border-gaming-accent/20">
            <SelectItem value="score">Score Dispute</SelectItem>
            <SelectItem value="rules">Rules Violation</SelectItem>
            <SelectItem value="behavior">Player Behavior</SelectItem>
            <SelectItem value="technical">Technical Issue</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Textarea
          {...register('description', { required: true })}
          placeholder="Describe the issue in detail..."
          className="bg-gaming-dark/50 border-gaming-accent/20 text-white min-h-[100px]"
        />
      </div>
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-gaming-accent hover:bg-gaming-accent/80"
      >
        Submit Dispute
      </Button>
    </form>
  );
};

export default DisputeForm;