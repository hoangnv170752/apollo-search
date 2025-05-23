"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, Twitter, Linkedin, Mail, Globe, BookOpen } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <>
      <div
        className="fixed inset-0 bg-[url('/circular-library.jpeg')] bg-cover bg-center bg-no-repeat"
        style={{
          zIndex: -1,
        }}
      ></div>
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary drop-shadow-md">About the Author</h1>
          <p className="mt-2 inline-block px-3 py-1 rounded-md bg-black/70 dark:bg-white/10 backdrop-blur-sm text-white font-medium">
            The minds behind Apollo Search
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="border-primary/20 bg-background/95 backdrop-blur h-full">
              <CardHeader className="text-center">
                <div className="mx-auto rounded-full overflow-hidden w-32 h-32 mb-4 border-2 border-primary/50">
                  <Image 
                    src="/profile.jpeg" 
                    alt="Profile" 
                    width={128} 
                    height={128}
                    className="object-cover"
                  />
                </div>
                <CardTitle>Hoang Nguyen</CardTitle>
                <CardDescription>Lead Developer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-center">
                  <p className="font-medium">Based in Hanoi, Vietnam</p>
                  <p className="text-muted-foreground">Fullstack Developer & Language Lover</p>
                </div>
                
                <div className="flex justify-center space-x-2">
                  <Button variant="outline" size="icon" asChild>
                    <a href="https://github.com/hoangnv170752" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href="https://twitter.com/HoangNguyen0299" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                      <Twitter className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href="https://www.linkedin.com/in/ho%C3%A0ng-nguy%E1%BB%85n-v%C4%83n-0a6771225" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href="mailto:hoang.nv.ral@gmail.com" aria-label="Email">
                      <Mail className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card className="border-primary/20 bg-background/95 backdrop-blur h-full">
              <CardHeader>
                <CardTitle>About Me</CardTitle>
                <CardDescription>Developer & Researcher</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Hello! I'm Nguyen Van Hoang, a Fullstack Developer, double-degree bachelor and a language lover with a passion for academic research tools 
                  and knowledge management systems. I got a lot of love from my love, my family and friends. Raised a 6 years old dog named Kem.
                  Apollo Search is my project to make scholarly research more accessible 
                  and efficient.
                </p>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Research Interests</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Natural Language Processing</li>
                    <li>Information Retrieval</li>
                    <li>Academic Search Systems</li>
                    <li>Machine Learning Applications</li>
                    <li>Fullstack Development</li>
                    <li>Blockchain</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">About Apollo Search</h3>
                  <p>
                    Apollo Search was developed to address the challenges researchers face when finding relevant academic papers. 
                    Using the Perplexity API, the application offers natural language search capabilities for scholarly content, 
                    making research discovery more intuitive.
                  </p>
                  <p className="mt-2">
                    Key features include advanced search options, paper saving capabilities, and integration with research databases 
                    like OpenAlex to provide comprehensive scholarly information.
                  </p>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <h3 className="text-lg font-medium mb-2">Get in Touch</h3>
                  <p>
                    If you have questions, suggestions, or would like to collaborate on research tools, feel free to reach out 
                    through any of the social links or directly via email.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button asChild className="bg-primary hover:bg-primary/90">
                      <a href="mailto:contact@example.com">
                        <Mail className="mr-2 h-4 w-4" />
                        Contact Me
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="https://github.com/hoangnv170752/apollo-search" target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        View Project
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="w-full flex flex-wrap gap-2 justify-center">
                  {/* Buttons removed as requested */}
                </div>
              </CardFooter>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            <Card className="border-primary/20 bg-background/95 backdrop-blur">
              <CardHeader>
                <CardTitle>Publications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="p-4 rounded-lg border border-border">
                    <h3 className="font-medium">Multi-access Edge Computing Architecture and Smart Agriculture Application in Ubiquitous Power Internet of Things</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      SSRN Electronic Journal
                    </p>
                    <p className="text-sm mt-1">
                      <a
                        href="https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4618689"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        View Publication
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
