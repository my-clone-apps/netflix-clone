import { NextApiRequest, NextApiResponse } from 'next';

import prismadb from '@/lib/prismadb';
import serverAuth from '@/lib/serverAuth';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if(req.method !== 'GET') {
        return res.status(405);
    }

    try {
        await serverAuth(req, res);

        const movies = await prismadb.movie.findMany();

        res.status(200).json(movies);
    } catch (error) {
        console.error(error);
        res.status(400);
    }
}