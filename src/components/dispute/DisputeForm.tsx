import React from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DisputeFormProps {
  matchId: string;
  againstId: string;
  onDisputeCreated: () => void;
}

interface DisputeFormData {
  title: string;
  description: string;
}

const DisputeForm = ({ matchId, againstId, onDisputeCreated }: DisputeFormProps) => {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<DisputeFormData>();

  const onSubmit = async (data: DisputeFormData) => {
    try {
      const { error } = await supabase
        .from('dispute_cases')
        .insert({
          match_id: matchId,
          against_id: againstId,
          title: data.title,
          description: data.description,
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