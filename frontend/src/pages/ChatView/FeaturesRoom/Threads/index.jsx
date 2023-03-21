import React from 'react';
import { useParams } from 'react-router-dom';
import { ListThread } from './ListThread';
import { ThreadDetail } from './ThreadDetail';

export const Threads = () => {
    const { threadId } = useParams();
    console.log(threadId);
    return (
        <>
            { threadId ? <ThreadDetail /> : <ListThread /> } 
        </>
    )
}