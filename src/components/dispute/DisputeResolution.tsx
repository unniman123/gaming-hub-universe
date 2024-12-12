import React from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface DisputeResolutionProps {
  disputeId: string;
  onResolutionSubmitted: () => void;
}

interface ResolutionFormData {
  resolution: string;
  resolution_type: string;
  admin_notes: string;
}

const DisputeResolution = ({ disputeId, onResolutionSubmitted }: DisputeResolutionProps) => {
  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm<ResolutionFormData>();

  const onSubmit = async (data: ResolutionFormData) => {
    try {
      const { error } = await supabase
        .from('dispute_cases')
        .update({
          resolution: data.resolution,
          resolution_type: data.resolution_type,
          admin_notes: data.admin_notes,
          status: 'resolved',
          updated_at: new Date().toISOString()
        })
        .eq('id', disputeId);

      if (error) throw error;

      toast.success('Resolution submitted successfully');
      onResolutionSubmitted();
    } catch (error) {
      console.error('Error submitting resolution:', error);
      toast.error('Failed to submit resolution');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Select onValueChange={(value) => setValue('resolution_type', value)}>
          <SelectTrigger className="bg-gaming-dark/50 border-gaming-accent/20 text-white">
            <SelectValue placeholder="Select resolution type" />
          </SelectTrigger>
          <SelectContent className="bg-gaming-dark border-gaming-accent/20">
            <SelectItem value="upheld">Dispute Upheld</SelectItem>
            <SelectItem value="rejected">Dispute Rejected</SelectItem>
            <SelectItem value="compromise">Compromise Reached</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Textarea
          {...register('resolution', { required: true })}
          placeholder="Enter resolution details..."
          className="bg-gaming-dark/50 border-gaming-accent/20 text-white min-h-[100px]"
        />
      </div>
      <div>
        <Textarea
          {...register('admin_notes', { required: true })}
          placeholder="Admin notes (internal only)..."
          className="bg-gaming-dark/50 border-gaming-accent/20 text-white min-h-[100px]"
        />
      </div>
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-gaming-accent hover:bg-gaming-accent/80"
      >
        Submit Resolution
      </Button>
    </form>
  );
};

export default DisputeResolution;