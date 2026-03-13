"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth/auth-client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const result = await signUp.email({
        name,
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message ?? "Failed to sign up");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white p-4">
        <Card className="w-full max-w-md border-gray-200 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-black">Sign Up</CardTitle>
            <CardDescription className="text-gray-600">
              Create an Account to start tracking your Job Application
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <CardContent className="space-y-4">
               {error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                id="name" 
                type="text" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                className="border-gray-300 focus:border-primary focus:ring-primary"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                id="email" 
                type="email" 
                placeholder="johndoe@hotmail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="border-gray-300 focus:border-primary focus:ring-primary"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                id="password" 
                type="pasword" 
                placeholder="**********" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                minLength={8} 
                className="border-gray-300 focus:border-primary focus:ring-primary"/>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 mt-4"
                disabled={loading}
                >
                  {loading ? "Creating account..." : "Sign Up"}
              </Button>
              <p className="text-center text-sm text-gray-600">Already have an account? <Link href="/sign-in" className="text-purple-600 font-bold">Sign In</Link></p> 
            </CardFooter>
          </form>
        </Card>     
    </div>
  );
}