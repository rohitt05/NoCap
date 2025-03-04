// components/responses/ResponseItem.tsx
import React from 'react';
import { ResponseItemProps } from '../types';
import TextResponse from './TextResponse';
import AudioResponse from './AudioResponse';
import MediaResponse from './MediaResponse';

const ResponseItem: React.FC<ResponseItemProps> = ({ item }) => {
    console.log(`Rendering response item of type: ${item.type}, id: ${item.id}`);

    // Render based on content type
    switch (item.type) {
        case 'text':
            return <TextResponse item={item} />;
        case 'audio':
            return <AudioResponse item={item} />;
        case 'image':
        case 'video':
        case 'gif':
            return <MediaResponse item={item} />;
        default:
            console.warn(`Unknown response type: ${item.type}`);
            return null;
    }
};

export default ResponseItem;