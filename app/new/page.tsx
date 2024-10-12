'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { X } from "lucide-react"

export default function NewPost() {
  const router = useRouter()
  const [heading, setHeading] = useState("")
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addTag = () => {
    if (currentTag.trim() !== "" && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
  
    try {
      const response = await fetch('/api/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          heading,
          code,
          language,
          tags,
        }),
      })
  
      if (!response.ok) {
        throw new Error('Failed to create post')
      }
  
      const data = await response.json()
      console.log('Post created:', data)
  
      
      router.push('/dashboard')
    } catch (error) {
      console.error('Error creating post:', error)
      
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="grainy">
          <CardTitle className="text-2xl font-bold text-center ">Create Snippets</CardTitle>
        </CardHeader>
        <CardContent className="grainy">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="heading" className="text-sm font-medium text-gray-700">
                Heading
              </label>
              <Input
                id="heading"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                placeholder="Enter title"
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="code" className="text-sm font-medium text-gray-700">
                Code
              </label>
              <Textarea
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste your code"
                className="w-full min-h-[150px]"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="language" className="text-sm font-medium text-gray-700">
                Language
              </label>
              <Input
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="Enter programming language"
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium text-gray-700">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                  <span key={tag} className="border rounded-xl p-2 flex items-center">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 focus:outline-none">
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={handleTagInputKeyPress}
                  placeholder="Enter a tag"
                  className="w-full"
                />
                <Button type="button" onClick={addTag}>Add Tag</Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}