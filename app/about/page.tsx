import type { Metadata } from "next"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "About Us | Hayoma Dairy",
  description: "Learn about Hayoma Dairy's history, mission, values, and the team behind our quality dairy products.",
}

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <div className="relative h-[500px] w-full overflow-hidden">
        <Image src="/about-hero.jpg" alt="Dairy farm landscape" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Hayoma Dairy</h1>
            <p className="text-lg md:text-xl">
              Delivering quality dairy products since 1985. Our commitment to excellence and sustainability drives
              everything we do.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              The journey of Hayoma Dairy began with a simple vision: to provide the freshest, highest-quality dairy
              products while supporting local farmers and sustainable practices.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">From Humble Beginnings</h3>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Founded in 1985 by the Hayoma family, our company started as a small operation with just 15 cows and a
                passion for quality dairy. John and Martha Hayoma began by selling milk to their neighbors and local
                stores in Milkville.
              </p>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                As word spread about the exceptional quality of their products, demand grew rapidly. By 1995, Hayoma
                Dairy had expanded to work with over 20 local farms and had introduced a range of products including
                cheese, yogurt, and butter.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Today, we're proud to be a leading dairy supplier in the region, still family-owned and committed to the
                same values of quality, sustainability, and community support that guided us from the beginning.
              </p>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image src="/about-history.jpg" alt="Hayoma Dairy historical photo" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="py-16 bg-blue-50 dark:bg-blue-950">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Mission & Values</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              At Hayoma Dairy, our mission is to deliver exceptional dairy products while promoting sustainable farming
              practices and supporting our local community.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">Quality First</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  We never compromise on quality. From farm to table, we maintain the highest standards in every step of
                  our production process.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">Sustainability</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  We're committed to environmentally responsible practices, from sustainable farming to eco-friendly
                  packaging and waste reduction.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">Community Support</h3>
                <p className="text-gray-600 dark:text-gray-400 text-center">
                  We believe in supporting local farmers and giving back to the communities that have supported us
                  throughout our journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Leadership Team</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Meet the dedicated professionals who lead Hayoma Dairy with passion and expertise.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Robert Hayoma",
                position: "CEO & Founder",
                image: "/team/ceo.jpg",
                bio: "Robert has led Hayoma Dairy for over 20 years, continuing the family legacy with innovation and vision.",
              },
              {
                name: "Sarah Johnson",
                position: "Operations Director",
                image: "/team/operations.jpg",
                bio: "Sarah oversees all operations, ensuring efficiency while maintaining our high quality standards.",
              },
              {
                name: "Michael Chen",
                position: "Head of Production",
                image: "/team/production.jpg",
                bio: "Michael brings 15 years of dairy production expertise to ensure our products meet the highest standards.",
              },
              {
                name: "Emily Rodriguez",
                position: "Sustainability Manager",
                image: "/team/sustainability.jpg",
                bio: "Emily leads our sustainability initiatives, driving our commitment to environmentally responsible practices.",
              },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden mb-4">
                  <Image
                    src={member.image || "/placeholder.svg?height=256&width=256"}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-primary font-medium mb-2">{member.position}</p>
                <p className="text-gray-600 dark:text-gray-400">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-blue-50 dark:bg-blue-950">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Achievements</h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              We're proud of our journey and the milestones we've achieved along the way.
            </p>
          </div>

          <div className="relative">
            {/* Timeline */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary"></div>

            <div className="space-y-12">
              {[
                {
                  year: "1985",
                  title: "Company Founded",
                  description: "Hayoma Dairy was established by the Hayoma family with a small herd of 15 cows.",
                },
                {
                  year: "1995",
                  title: "Product Expansion",
                  description:
                    "Expanded our product line to include cheese, yogurt, and butter, working with 20+ local farms.",
                },
                {
                  year: "2005",
                  title: "Sustainability Initiative",
                  description:
                    "Launched our comprehensive sustainability program, reducing our carbon footprint by 30%.",
                },
                {
                  year: "2015",
                  title: "Regional Excellence Award",
                  description:
                    "Received the Regional Excellence Award for our contribution to sustainable agriculture.",
                },
                {
                  year: "2023",
                  title: "Digital Transformation",
                  description:
                    "Implemented our digital management system to streamline operations and improve service.",
                },
              ].map((achievement, index) => (
                <div
                  key={index}
                  className={`relative flex md:items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div className="hidden md:block w-1/2"></div>
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center">
                    <div className="h-8 w-8 rounded-full bg-primary"></div>
                  </div>
                  <div className="md:w-1/2 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
                    <div className="md:hidden h-8 w-8 rounded-full bg-primary mb-4"></div>
                    <span className="inline-block px-3 py-1 bg-primary text-white text-sm font-semibold rounded-full mb-2">
                      {achievement.year}
                    </span>
                    <h3 className="text-xl font-bold mb-2">{achievement.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
