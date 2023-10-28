import { NextApiRequest, NextApiResponse } from 'next';

import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        if(req.method !== 'GET') {
            return res.status(405);
        }

        const { currentUser } = await serverAuth(req, res);

        const favoriteMovies = await prismadb.movie.findMany({
            where: {
                id: {
                    in: currentUser?.favoriteIds
                }
            }
        });

        return res.status(200).json(favoriteMovies);
    } catch (error) {
        console.error(error);
        res.status(400);
    }
}