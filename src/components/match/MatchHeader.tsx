import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const MatchHeader = () => {
  const navigate = useNavigate();
  
  return (
    <Button
      variant="ghost"
      className="mb-6"
      onClick={() => navigate(-1)}
    >
      <ArrowLeft className="mr-2" />
      Back
    </Button>
  );
};

export default MatchHeader;