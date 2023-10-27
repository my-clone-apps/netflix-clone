import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
    if(req.method !== 'POST') {
        return res.status(405);
    }

    try {
        const { email, name, password } = req.body;

        const existingUser = await prismadb.user.findUnique({
            where: {
                email
            }
        });

        if(existingUser) {
            return res.status(422).json({ error: 'Email taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await prismadb.user.create({
            data: {
                email,
                name,
                hashedPassword,
                image: '',
                emailVerified: new Date(),
            }
        });

        return res.status(200).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(400);
    }
}