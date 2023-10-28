import { NextApiRequest, NextApiResponse } from 'next';

import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if(req.method !== 'GET') {
        return res.status(405);
    }

    try {
        await serverAuth(req, res);

        const { movieId } = req.query;

        if(typeof movieId !== 'string') {
            throw new Error('Invalid movieId provided');
        }

        if(!movieId) {
            throw new Error('No movieId provided');
        }

        const movie = await prismadb.movie.findUnique({
            where: {
                id: movieId
            }
        });

        if(!movie) {
            throw new Error('Movie not found');
        }

        res.status(200).json(movie);
    } catch (error) {
        console.error(error);
        res.status(400);
    }
}