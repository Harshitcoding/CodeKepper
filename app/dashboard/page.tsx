'use client'

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code2, ClipboardCopy, Check,Trash2 } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Initialpage from '@/components/Initialpage';
import Loading from '@/components/Loading';

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
  const [editMode, setEditMode] = useState(false);
  const [updatedPostData, setUpdatedPostData] = useState<{ heading?: string; code?: string; language?: string }>({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/dashboard', { method: 'GET' });
        if (!response.ok) throw new Error('Failed to fetch posts');
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
    setUpdatedPostData({ heading: post.heading, code: post.code, language: post.language });
    setCopied(false);
    setEditMode(false);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setCopied(false);
    setEditMode(false);
  };

  const handleCopy = async () => {
    if (selectedPost?.code) {
      try {
        await navigator.clipboard.writeText(selectedPost.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this snippet?')) {
      try {
        const response = await fetch(`/api/new/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete post');
        setPosts(posts.filter(post => post.id !== id));
        closeModal();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleUpdate = async () => {
    if (selectedPost) {
      try {
        const response = await fetch(`/api/new/${selectedPost.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedPostData),
        });

        if (!response.ok) throw new Error('Failed to update post');
        
        setPosts(posts.map(post => (post.id === selectedPost.id ? { ...post, ...updatedPostData } : post)));
        
        closeModal();
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md bg-black border-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-center text-white">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-white">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-black shadow-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <DashboardHeader />
        </div>
      </header>
      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {loading ? (
         <div>
         <Loading/>
         </div>
        ) : posts.length === 0 ? (
          <Initialpage />
        ) : (
          <div  
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {posts.map((post) => (
              <div
                key={post.id}
              >
                <Card
                  className="overflow-hidden cursor-pointer hover:shadow-xl hover:bg-gray-750 transition-all duration-300 h-full flex flex-col bg-black border-gray-800 text-white"
                  onClick={() => handlePostClick(post)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl text-white">
                      <Code2 className="h-5 w-5" />
                      {post.heading}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto max-h-40 ">
                      <SyntaxHighlighter language={post.language} style={dracula} customStyle={{ margin: 0 }}>
                        {post.code.slice(0, 100)}...
                      </SyntaxHighlighter>
                    </pre>
                  </CardContent>
                  <CardFooter className="flex flex-wrap items-center gap-2 mt-auto">
                    <Badge variant="secondary" className="text-xs text-purple-400 border ">{post.language}</Badge>
                    {post.tags.map((tag) => (
                      <Badge key={tag.id} variant="outline" className="text-xs text-white">
                        {tag.name}
                      </Badge>
                    ))}
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        )}
      </main>

      <Dialog open={!!selectedPost} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-black border border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-white">
              <Code2 className="h-6 w-6" />
              {selectedPost?.heading}
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {editMode ? (
              <>
                <input 
                  type="text" 
                  value={updatedPostData.heading} 
                  onChange={(e) => setUpdatedPostData({ ...updatedPostData, heading: e.target.value })} 
                  placeholder="Heading" 
                  className="w-full p-2 border rounded-md text-black"
                />
                <textarea 
                  value={updatedPostData.code} 
                  onChange={(e) => setUpdatedPostData({ ...updatedPostData, code: e.target.value })} 
                  placeholder="Code" 
                  rows={5} 
                  className="w-full p-2 border rounded-md text-black h-72"
                />
                <input 
                  type="text" 
                  value={updatedPostData.language} 
                  onChange={(e) => setUpdatedPostData({ ...updatedPostData, language: e.target.value })} 
                  placeholder="Language" 
                  className="w-full p-2 border rounded-md text-black"
                />
                
                <Button onClick={handleUpdate}>Update Snippet</Button>

              </>
            ) : (
              <>
                <div className="w-full overflow-x-auto">
                  <pre className="border rounded-md max-h-[400px] overflow-y-auto bg-gray-800">
                    <SyntaxHighlighter language={selectedPost?.language} style={dracula} customStyle={{ margin: 0 }}>
                      {selectedPost?.code || "No Code"}
                    </SyntaxHighlighter>
                  </pre>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-xs text-purple-400 border ">{selectedPost?.language}</Badge>
                  {selectedPost?.tags.map((tag) => (
                    <Badge key={tag.id} variant="outline" className="text-white">
                      {tag.name}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button onClick={handleCopy}>
                    {copied ? (
                      <>
                        <Check className="h-5 w-5 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <ClipboardCopy className="h-5 w-5 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>

                  {selectedPost && (
                    <>
                      <Button onClick={() => handleDelete(selectedPost.id)} variant="destructive">
                        <Trash2 className="h-5 w-5 mr-2" />
                        Delete Snippet
                      </Button>

                      <Button onClick={() => setEditMode(true)}>Edit Snippet</Button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}