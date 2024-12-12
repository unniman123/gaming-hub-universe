import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';

export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      <SessionContextProvider supabaseClient={supabase}>
        {ui}
      </SessionContextProvider>
    </BrowserRouter>
  );
}