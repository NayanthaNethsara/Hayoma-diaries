import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Contact Us | Hayoma Dairy",
  description: "Get in touch with Hayoma Dairy for inquiries, feedback, or support.",
}

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header Banner */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image src="/contact-banner.jpg" alt="Dairy farm landscape" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
            <p className="text-lg">We'd love to hear from you</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Contact Form */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input id="name" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help you?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Your message here..." rows={5} />
                </div>
                <Button type="submit" className="w-full sm:w-auto">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-muted-foreground">
                        123 Dairy Farm Road
                        <br />
                        Milkville, CA 90210
                        <br />
                        United States
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-muted-foreground">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-muted-foreground">info@hayomadairy.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Business Hours</h3>
                      <p className="text-muted-foreground">
                        Monday - Friday: 8:00 AM - 6:00 PM
                        <br />
                        Saturday: 9:00 AM - 4:00 PM
                        <br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Follow Us</h2>
                <div className="flex gap-4">
                  <Link
                    href="#"
                    className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    <Facebook className="h-6 w-6 text-primary" />
                  </Link>
                  <Link
                    href="#"
                    className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    <Twitter className="h-6 w-6 text-primary" />
                  </Link>
                  <Link
                    href="#"
                    className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                  >
                    <Instagram className="h-6 w-6 text-primary" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Our Location</h2>
          <div className="h-96 w-full rounded-lg overflow-hidden border">
            <div className="relative h-full w-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
              <Image src="/map-placeholder.jpg" alt="Map location" fill className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg">
                  <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="font-bold">Hayoma Dairy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
