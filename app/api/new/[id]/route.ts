import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const postId = parseInt(params.id); // Convert id to an integer

    // Fetch the post
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { user: true },
    });

    // Check if post exists
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    // Check if the current user is the author of the post
    if (post.userId !== userId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Delete the post
    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ message: 'Error deleting post', error }, { status: 500 });
  }
}


export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
      const { userId } = getAuth(req);
      if (!userId) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
  
      const postId = parseInt(params.id); // Convert id to an integer
  
      // Fetch the post
      const post = await prisma.post.findUnique({
        where: { id: postId },
        include: { user: true },
      });
  
      // Check if post exists
      if (!post) {
        return NextResponse.json({ message: 'Post not found' }, { status: 404 });
      }
  
      // Check if the current user is the author of the post
      if (post.userId !== userId) {
        return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
  
      // Parse the request body to get updated data
      const updatedData = await req.json();
  
      // Update the post
      const updatedPost = await prisma.post.update({
        where: { id: postId },
        data: {
          heading: updatedData.heading,  
          code: updatedData.code,         
          language: updatedData.language, 
          
        },
      });
  
      return NextResponse.json({ message: 'Post updated successfully', post: updatedPost }, { status: 200 });
    } catch (error) {
      console.error('Error updating post:', error);
      return NextResponse.json({ message: 'Error updating post', error }, { status: 500 });
    }
  }