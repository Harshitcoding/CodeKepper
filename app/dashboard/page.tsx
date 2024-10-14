'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Code2, ClipboardCopy, Check } from "lucide-react";
import DashboardHeader from '@/components/DashboardHeader';
import Lottie from "lottie-react";
import dashboard from "@/assets/lotties/dashboard.json";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // Assuming you have a Button component

interface Post {
  id: string;
  heading: string;
  code: string;
  language: string;
  tags: { id: string; name: string }[];
}

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/dashboard', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        setPosts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
    setCopied(false); // Reset copied state when opening a new modal
  };

  const closeModal = () => {
    setSelectedPost(null);
    setCopied(false); // Reset copied state when closing the modal
  };

  const handleCopy = () => {
    if (selectedPost?.code) {
      navigator.clipboard.writeText(selectedPost.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset the copy feedback after 2 seconds
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-black">
      <header className="bg-black shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <DashboardHeader />
        </div>
      </header>
      <main className="container mx-auto py-6 px-4">
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-0">
                  <Skeleton className="h-6 w-2/3" />
                </CardHeader>
                <CardContent className="pb-0">
                  <Skeleton className="h-24 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-4 w-20" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-black p-6">
            <div className="flex flex-row items-center space-x-4">
              <Lottie animationData={dashboard} loop={true} className="w-72 md:w-96" />
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Welcome to Your Dashboard!</h2>
                <p className="text-lg">
                  It looks like you haven't created any code snippets yet.
                </p>
                <p className="mt-4 text-gray-300">
                  Start your coding journey by creating your first snippet!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
                onClick={() => handlePostClick(post)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="h-5 w-5" />
                    {post.heading}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-0">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>{post.code.slice(0, 100)}...</code>
                  </pre>
                </CardContent>
                <CardFooter className="flex flex-wrap items-center gap-2 mt-4">
                  <Badge variant="secondary">{post.language}</Badge>
                  {post.tags.map((tag) => (
                    <Badge key={tag.id} variant="outline">
                      {tag.name}
                    </Badge>
                  ))}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Dialog open={!!selectedPost} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              {selectedPost?.heading}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 flex items-start justify-between">
            <pre className="border border-black text-black p-4 rounded-md overflow-x-auto max-h-[400px] w-full">
              <code>{selectedPost?.code}</code>
            </pre>
            <Button
              
              className="ml-4 flex items-center"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-5 w-5 mr-2" />
              ) : (
                <ClipboardCopy className="h-5 w-5 mr-2" />
              )}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <Badge variant="secondary">{selectedPost?.language}</Badge>
            {selectedPost?.tags.map((tag) => (
              <Badge key={tag.id} variant="outline">
                {tag.name}
              </Badge>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
