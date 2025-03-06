// types.ts


export interface Reaction {
    profile_picture_url: string;
    emoji: string;
}

export interface ResponseItemData {
    response_content: string;
    username: string;
    // response_type: any;
    id: string;
    response_type: 'text' | 'image' | 'video' | 'audio' | 'gif';
    user: string;
    profile_picture_url: string;
    timestamp: string;
    text?: string;
    media_url?: string;
    thumbnail_url?: string;
    caption?: string;
    duration?: string;
    reactions?: Reaction[];
}

export interface ResponsesData {
    responses_received: ResponseItemData[];
}

export interface ResponseItemProps {
    item: ResponseItemData;
}