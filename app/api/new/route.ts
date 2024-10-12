import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuth, clerkClient } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const clerkUser = await clerkClient.users.getUser(userId);
    const username = clerkUser.primaryEmailAddress?.emailAddress
    const imageUrl = clerkUser.imageUrl;

    const { heading, code, language, tags } = await req.json();

 
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: { 
        username: username,
        imageUrl: imageUrl
      },
      create: { 
        id: userId, 
        username: username,
        imageUrl: imageUrl
      },
    });

    // Create the post
    const post = await prisma.post.create({
      data: {
        heading,
        code,
        language,
        userId: user.id,
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
      include: {
        tags: true,
        user: {
          select: {
            username: true,
            imageUrl: true
          }
        }
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ message: 'Error creating post', error }, { status: 500 });
  }
}



