"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, LogIn, LayoutDashboard, UtensilsCrossed, Clock, CreditCard, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-orange-500 to-red-500 p-2 rounded-xl shadow-lg">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              College Canteen
            </h1>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="outline" className="border-orange-300 hover:bg-orange-50">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                <UserPlus className="mr-2 h-4 w-4" />
                Register
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-block px-4 py-2 bg-orange-100 rounded-full border border-orange-300 mb-4">
            <span className="text-orange-700 font-semibold text-sm">🎓 Smart Campus Dining</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Welcome to
            <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent block mt-2">
              College Main Canteen
            </span>
          </h2>
          
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Quick, convenient, and delicious meals for students and staff. Order online with your RFC card and skip the queue!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/canteen">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg text-lg px-8 py-6">
                <UtensilsCrossed className="mr-2 h-6 w-6" />
                Order Now
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-orange-300 hover:bg-orange-50 text-lg px-8 py-6">
                <UserPlus className="mr-2 h-6 w-6" />
                Get RFC Card
              </Button>
            </Link>
          </div>

          {/* Quick Info Banner */}
          <div className="flex flex-wrap justify-center items-center gap-6 pt-8 text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <span className="font-medium">7:00 AM - 9:00 PM</span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-orange-500" />
              <span className="font-medium">RFC Card Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <span className="font-medium">Fresh & Hygienic</span>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 max-w-6xl mx-auto">
          <Card className="border-orange-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-orange-50">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                <UtensilsCrossed className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-xl">Wide Menu Selection</CardTitle>
              <CardDescription className="text-base">
                Breakfast, lunch, dinner, snacks, and beverages - all your favorites in one place
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-orange-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-red-50">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                <CreditCard className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-xl">RFC Card Payment</CardTitle>
              <CardDescription className="text-base">
                Quick and secure payment with your student RFC card - no cash needed
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-orange-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-pink-50">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                <Clock className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-xl">Skip the Queue</CardTitle>
              <CardDescription className="text-base">
                Order online and save time - no more waiting in long lines
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-orange-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-orange-50">
            <CardHeader>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
                <LayoutDashboard className="h-7 w-7 text-white" />
              </div>
              <CardTitle className="text-xl">Track Your Orders</CardTitle>
              <CardDescription className="text-base">
                Real-time order tracking and balance management through your dashboard
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Location & Hours */}
        <div className="mt-20 max-w-4xl mx-auto">
          <Card className="border-orange-200 bg-gradient-to-br from-white to-orange-50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Visit Us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center md:text-left">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">📍 Location</h3>
                  <p className="text-gray-600">Campus Block A</p>
                  <p className="text-gray-600">Ground Floor, Main Building</p>
                  <p className="text-sm text-gray-500 mt-2">canteen@college.edu</p>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="font-bold text-lg mb-2 text-gray-800">🕐 Opening Hours</h3>
                  <div className="space-y-1 text-gray-600">
                    <p><span className="font-medium">Breakfast:</span> 7:00 AM - 10:00 AM</p>
                    <p><span className="font-medium">Lunch:</span> 12:00 PM - 3:00 PM</p>
                    <p><span className="font-medium">Dinner:</span> 6:00 PM - 9:00 PM</p>
                    <p className="text-sm text-gray-500 mt-2">Open Monday - Saturday</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-12 shadow-2xl">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Order?
            </h3>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Get started with your RFC card and enjoy delicious meals at your fingertips
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/canteen">
                <Button size="lg" className="w-full sm:w-auto bg-white text-orange-600 hover:bg-gray-100 shadow-lg text-lg px-8 py-6">
                  <UtensilsCrossed className="mr-2 h-6 w-6" />
                  Browse Menu
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                  <UserPlus className="mr-2 h-6 w-6" />
                  Register Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}