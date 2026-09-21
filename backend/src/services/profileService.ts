import prisma from '../config/prisma';
import { AppError } from '../utils/AppError';

export const getProfile = async (userId: string) => {
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

export const updateProfile = async (userId: string, role: string, data: any) => {
  const updateData: any = {};

  if (role === 'JOB_SEEKER') {
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.phone !== undefined) updateData.phone = data.phone || null;
    if (data.bio !== undefined) updateData.bio = data.bio || null;
  } else if (role === 'COMPANY') {
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.companyName !== undefined) updateData.companyName = data.companyName;
    if (data.description !== undefined) updateData.description = data.description || null;
    if (data.location !== undefined) updateData.location = data.location || null;
    if (data.website !== undefined) updateData.website = data.website || null;
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
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

  return user;
};
