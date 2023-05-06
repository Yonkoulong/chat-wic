import React from 'react';
import { useParams } from 'react-router-dom';
import { ListThread } from './ListThread';
import { ThreadDetail } from './ThreadDetail';

export const Threads = () => {
    const { threadId } = useParams();
    return (
        <>
            { threadId ? <ThreadDetail /> : <ListThread /> } 
        </>
    )
}