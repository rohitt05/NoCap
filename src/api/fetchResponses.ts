import { supabase } from '../../Lib/supabase';

/**
 * Fetches user responses from the Supabase database with usernames.
 * @returns {Promise<{data: any[] | null, error: Error | null}>}
 */
export const fetchResponses = async () => {
    try {
        // Get all responses
        const { data: responses, error: responsesError } = await supabase
            .from('prompt_responses')
            .select('*')
            .order('created_at', { ascending: false });

        if (responsesError) throw responsesError;

        // Get user data for these responses
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('id, username, email')
            .in('id', responses.map(r => r.user_id));

        if (usersError) throw usersError;

        // Create a map for quick user lookups
        const userMap = {};
        users.forEach(user => {
            userMap[user.id] = user;
        });

        // Combine the data
        const formattedData = responses.map(response => ({
            ...response,
            username: userMap[response.user_id]?.username || 'Unknown User',
            timestamp: response.created_at // Map created_at to timestamp for component compatibility
        }));

        console.log('Successfully joined data:', formattedData);
        return { data: formattedData, error: null };
    } catch (err) {
        console.error('Supabase Fetch Error:', err.message);
        return { data: null, error: err.message };
    }
};