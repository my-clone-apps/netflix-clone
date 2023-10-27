import { NextApiRequest, NextApiResponse } from 'next';

import serverAuth from '@/lib/serverAuth';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if(req.method !== 'GET') {
        return res.status(405);
    }

    try {
        const { currentUser } = await serverAuth(req);

        return res.status(200).json(currentUser);
    } catch (error) {
        console.error(error);
        res.status(400);
    }
}