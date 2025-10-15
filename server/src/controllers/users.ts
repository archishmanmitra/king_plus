import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export const listUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        employeeId: true,
        employee: {
          select:{
            official: {
              select: {
                firstName: true,
                lastName: true,
                designation:true,
                unit:true,
                confirmationDate:true
              }
            },
          },
          
        },
      },
    });
    return res.json({ users });
  } catch (e: any) {
    return res
      .status(500)
      .json({ error: e?.message || "Failed to fetch users" });
  }
};
