'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Code2, ClipboardCopy, Check, X } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import Lottie from 'lottie-react';
import dashboard from '@/assets/lotties/dashboard.json';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';

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
    setCopied(false);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setCopied(false);
  };

  const handleCopy = () => {
    if (selectedPost?.code) {
      navigator.clipboard.writeText(selectedPost.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
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
    <div className="min-h-screen bg-black dark:bg-gray-900 transition-colors duration-300">
      <header className="bg-black dark:bg-gray-800 shadow-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <DashboardHeader />
        </div>
      </header>
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
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
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8"
          >
            <Lottie animationData={dashboard} loop={true} className="w-72 md:w-96 mb-6" />
            <h2 className="text-3xl font-bold mb-4 text-center">Welcome to Your Dashboard!</h2>
            <p className="text-xl mb-4 text-center text-gray-600 dark:text-gray-300">
              It looks like you haven't created any code snippets yet.
            </p>
            <p className="text-lg text-center text-gray-500 dark:text-gray-400">
              Start your coding journey by creating your first snippet!
            </p>
            <Button className="mt-6" size="lg">
              Create Your First Snippet
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {posts.map((post) => (
              <motion.div
                key={post.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className="overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 h-full flex flex-col"
                  onClick={() => handlePostClick(post)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <Code2 className="h-5 w-5" />
                      {post.heading}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto max-h-40">
                      <SyntaxHighlighter language={post.language} style={dracula} customStyle={{ margin: 0 }}>
                        {post.code.slice(0, 100)}...
                      </SyntaxHighlighter>
                    </pre>
                  </CardContent>
                  <CardFooter className="flex flex-wrap items-center gap-2 mt-auto">
                    <Badge variant="secondary" className="text-xs">{post.language}</Badge>
                    {post.tags.map((tag) => (
                      <Badge key={tag.id} variant="outline" className="text-xs">
                        {tag.name}
                      </Badge>
                    ))}
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      <Dialog open={!!selectedPost} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-black">
              <Code2 className="h-6 w-6" />
              {selectedPost?.heading}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={closeModal}
            >
              <X className="h-4 w-4 bg-slate-500" />
            
            </Button>
          </DialogHeader>
          
          <div className="mt-4 flex flex-col sm:flex-row items-start justify-center gap-4 ">
            <div className="w-full sm:w-5/6 overflow-x-auto">
              <pre className="border border-gray-200 dark:border-gray-700 rounded-md max-h-[400px] overflow-y-auto">
                <SyntaxHighlighter language={selectedPost?.language} style={dracula} customStyle={{ margin: 0 }}>
                  {selectedPost?.code || "No Code"}
                </SyntaxHighlighter>
              </pre>
            </div>
           
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <Badge variant="secondary">{selectedPost?.language}</Badge>
            {selectedPost?.tags.map((tag) => (
              <Badge key={tag.id} variant="outline">
                {tag.name}
              </Badge>
            ))}
          </div>
          <Button>{copied ? <Check className="h-5 w-5 mr-2" /> : <ClipboardCopy className="h-5 w-5 mr-2" />}
          {copied ? 'Copied!' : 'Copy'}</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}