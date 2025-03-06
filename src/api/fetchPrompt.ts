import { supabase } from '../../Lib/supabase';

/**
 * Fetches the latest prompt from the Supabase database
 * @returns {Promise<{data: {text: string, time: string} | null, error: Error | null}>}
 */
export const fetchPrompt = async () => {
    try {
        const { data, error } = await supabase
            .from('prompts')
            .select('question')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error) throw error;

        return {
            data: {
                text: data.question,
                time: '00:00:00'
            },
            error: null
        };
    } catch (err) {
        return {
            data: null,
            error: err.message
        };
    }
};