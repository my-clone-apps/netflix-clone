import { NextApiRequest, NextApiResponse } from 'next';
import { without } from 'lodash';

import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { currentUser } = await serverAuth(req, res);
        const { movieId } = req.body;

        const existingMovie = await prismadb.movie.findUnique({
            where: {
                id: movieId
            }
        });

        if(!existingMovie) {
            throw new Error('Movie not found');
        }

        if(req.method === 'POST') {
            const user  = await prismadb.user.update({
                where: {
                    email: currentUser.email || ''
                },
                data: {
                    favoriteIds: {
                        push: movieId
                    }
                }
            });

            return res.status(200).json(user);
        }

        if(req.method === 'DELETE') {
            const updatedFavoriteIds = without(currentUser.favoriteIds, movieId);

            const user  = await prismadb.user.update({
                where: {
                    email: currentUser.email || ''
                },
                data: {
                    favoriteIds: updatedFavoriteIds
                }
            });

            return res.status(200).json(user);
        }

        return res.status(405);
    } catch (error) {
        console.error(error);
        res.status(400);
    }
}