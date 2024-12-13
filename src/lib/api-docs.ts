/**
 * API Documentation
 * 
 * This file contains documentation for all API endpoints used in the application.
 */

export const API_DOCUMENTATION = {
  tournaments: {
    list: {
      endpoint: '/api/tournaments',
      method: 'GET',
      description: 'Get all tournaments',
      response: 'Array of tournament objects',
      example: `
        const { data, error } = await supabase
          .from('tournaments')
          .select('*')
      `
    },
    create: {
      endpoint: '/api/tournaments',
      method: 'POST',
      description: 'Create a new tournament',
      body: {
        title: 'string',
        game_type: 'string',
        max_participants: 'number',
        prize_pool: 'number',
        start_date: 'Date'
      },
      example: `
        const { data, error } = await supabase
          .from('tournaments')
          .insert(tournamentData)
      `
    },
    join: {
      endpoint: '/api/tournaments/:id/join',
      method: 'POST',
      description: 'Join a tournament',
      example: `
        const { data, error } = await supabase
          .from('tournament_participants')
          .insert({
            tournament_id,
            player_id: userId
          })
      `
    }
  },
  matches: {
    list: {
      endpoint: '/api/matches',
      method: 'GET',
      description: 'Get user matches',
      example: `
        const { data, error } = await supabase
          .from('matches')
          .select('*')
          .or(\`player1_id.eq.\${userId},player2_id.eq.\${userId}\`)
      `
    },
    submitScore: {
      endpoint: '/api/matches/:id/score',
      method: 'POST',
      description: 'Submit match score',
      body: {
        score_player1: 'number',
        score_player2: 'number'
      },
      example: `
        const { error } = await supabase
          .from('matches')
          .update({ score_player1, score_player2 })
          .eq('id', matchId)
      `
    }
  },
  disputes: {
    create: {
      endpoint: '/api/disputes',
      method: 'POST',
      description: 'Create a dispute',
      body: {
        match_id: 'string',
        title: 'string',
        description: 'string'
      },
      example: `
        const { error } = await supabase
          .from('dispute_cases')
          .insert(disputeData)
      `
    },
    resolve: {
      endpoint: '/api/disputes/:id/resolve',
      method: 'POST',
      description: 'Resolve a dispute',
      body: {
        resolution: 'string',
        resolution_type: 'string'
      },
      example: `
        const { error } = await supabase
          .from('dispute_cases')
          .update({
            resolution,
            status: 'resolved'
          })
          .eq('id', disputeId)
      `
    }
  }
};