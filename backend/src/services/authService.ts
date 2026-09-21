import prisma from '../config/prisma';
import { hashPassword, comparePassword } from '../utils/password';
import { signToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';
import { Role } from '@prisma/client';

interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
  role: Role;
  companyName?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const register = async (input: RegisterInput) => {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new AppError('Email already registered', 409, 'EMAIL_ALREADY_EXISTS');
  }

  const hashedPassword = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      fullName: input.fullName,
      email: input.email,
      password: hashedPassword,
      role: input.role,
      companyName: input.role === 'COMPANY' ? input.companyName : null,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      companyName: true,
    },
  });

  const token = signToken({ userId: user.id, email: user.email, role: user.role });

  return { user, token };
};

export const login = async (input: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const valid = await comparePassword(input.password, user.password);
  if (!valid) {
    throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  const token = signToken({ userId: user.id, email: user.email, role: user.role });

  const { password: _, ...userData } = user;
  return { user: userData, token };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      companyName: true,
      phone: true,
      bio: true,
      description: true,
      location: true,
      website: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  return user;
};
