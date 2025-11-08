"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, LogIn, LayoutDashboard } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="border-b bg-white/50 backdrop-blur-sm dark:bg-gray-900/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">MyAccount</h1>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="outline">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Register
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Welcome to Your
            <span className="text-primary block mt-2">Account Portal</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Secure and easy account management. Register with your ID and phone number to get started.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                <UserPlus className="mr-2 h-5 w-5" />
                Create Account
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <LogIn className="mr-2 h-5 w-5" />
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
          <Card>
            <CardHeader>
              <UserPlus className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Easy Registration</CardTitle>
              <CardDescription>
                Quick and simple registration with your ID number and phone
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <LayoutDashboard className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Personal Dashboard</CardTitle>
              <CardDescription>
                Access your personalized dashboard with all your account details
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <LogIn className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Secure Login</CardTitle>
              <CardDescription>
                Your data is protected with secure authentication
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}