import { NextApiRequest, NextApiResponse } from "next";
import { HttpStatusCode } from "axios";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import prismaDb from "@/lib/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(HttpStatusCode.MethodNotAllowed).end();
  }
  try {
    const { name, email, password } = req.body;
    const existingUser: User = await prismaDb.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(HttpStatusCode.UnprocessableEntity).json("This email already exist");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user: User = await prismaDb.user.create({
      data: {
        email,
        name,
        hashedPassword,
        image: '',
        emailVerified: new Date(),
      }
    });
    return res.status(HttpStatusCode.Ok).json(user);
  } catch (e) {
    console.error(e);
    return res.status(HttpStatusCode.BadRequest).end();
  }
}
