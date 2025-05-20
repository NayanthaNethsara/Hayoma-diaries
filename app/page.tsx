import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section with Blue Gradient (Dark Navy in Dark Mode) */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden bg-gradient-to-br from-blue-500/90 via-blue-400/90 to-blue-600/90 dark:from-navy-800 dark:via-navy-700 dark:to-navy-900">
          {/* Decorative Shapes */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-300 dark:bg-navy-600"></div>
            <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-blue-400 dark:bg-navy-500"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-blue-300 dark:bg-navy-600"></div>
            <div className="absolute bottom-1/4 left-1/3 w-40 h-40 rounded-full bg-blue-200 dark:bg-navy-700"></div>
          </div>

          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                    Hayoma Dairy Company
                  </h1>
                  <p className="max-w-[600px] text-blue-50 md:text-xl">
                    Delivering fresh dairy products to your doorstep. Quality
                    you can trust, service you can rely on.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/login">
                    <Button
                      size="lg"
                      className="bg-white text-blue-700 hover:bg-blue-50 dark:bg-navy-200 dark:text-navy-800 dark:hover:bg-navy-100"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white bg-blue-500/30 hover:bg-blue-600/50 dark:border-navy-200 dark:bg-navy-500/40 dark:hover:bg-navy-400/50"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-full h-[350px] md:h-[550px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    alt="Dairy Products"
                    className="object-cover object-center"
                    fill
                    src="/logo.svg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section with Blue Accents (Dark Navy in Dark Mode) */}
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-navy-950"
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="inline-block rounded-lg bg-blue-100 dark:bg-navy-800/50 px-3 py-1 text-sm text-blue-600 dark:text-navy-200">
                Our Features
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-blue-600 dark:text-navy-300">
                  Why Choose Hayoma Dairy?
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  We combine tradition with innovation to deliver the finest
                  dairy products to your doorstep.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 md:gap-8">
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-blue-100 dark:border-navy-800/30 bg-white dark:bg-gray-900 p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 dark:bg-navy-600 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8"
                  >
                    <path d="M12 2v8"></path>
                    <path d="m4.93 10.93 1.41 1.41"></path>
                    <path d="M2 18h2"></path>
                    <path d="M20 18h2"></path>
                    <path d="m19.07 10.93-1.41 1.41"></path>
                    <path d="M22 22H2"></path>
                    <path d="m16 6-4 4-4-4"></path>
                    <path d="M16 18a4 4 0 0 0-8 0"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-600 dark:text-navy-300">
                  Fresh Products
                </h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  We deliver fresh dairy products daily to ensure quality and
                  taste.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-blue-100 dark:border-navy-800/30 bg-white dark:bg-gray-900 p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 dark:bg-navy-600 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-600 dark:text-navy-300">
                  Quality Assurance
                </h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  All our products undergo strict quality checks before
                  delivery.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border border-blue-100 dark:border-navy-800/30 bg-white dark:bg-gray-900 p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 dark:bg-navy-600 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-600 dark:text-navy-300">
                  Trusted Partners
                </h3>
                <p className="text-center text-gray-500 dark:text-gray-400">
                  We partner with local farmers who share our commitment to
                  quality.
                </p>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <Link href="/about">
                <Button
                  size="lg"
                  className="bg-blue-500 hover:bg-blue-600 text-white dark:bg-navy-600 dark:hover:bg-navy-500"
                >
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section with Navy Blue in Dark Mode */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-500 dark:bg-navy-700 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  What Our Customers Say
                </h2>
                <p className="max-w-[900px] text-blue-50 dark:text-navy-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Don't just take our word for it. Here's what our customers
                  have to say about Hayoma Dairy.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3 md:gap-8">
              <div className="flex flex-col items-center space-y-4 rounded-lg bg-white/10 dark:bg-navy-600/20 p-6 backdrop-blur-sm">
                <div className="relative h-16 w-16 overflow-hidden rounded-full">
                  <div className="absolute inset-0 bg-blue-300 dark:bg-navy-400 flex items-center justify-center text-blue-700 dark:text-navy-900 text-2xl font-bold">
                    JD
                  </div>
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-bold">John Doe</h3>
                  <p className="text-blue-50 dark:text-navy-100">
                    "The quality of Hayoma's dairy products is unmatched. I've
                    been a loyal customer for years!"
                  </p>
                  <div className="flex justify-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-5 w-5 text-yellow-300"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg bg-white/10 dark:bg-navy-600/20 p-6 backdrop-blur-sm">
                <div className="relative h-16 w-16 overflow-hidden rounded-full">
                  <div className="absolute inset-0 bg-blue-300 dark:bg-navy-400 flex items-center justify-center text-blue-700 dark:text-navy-900 text-2xl font-bold">
                    JS
                  </div>
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-bold">Jane Smith</h3>
                  <p className="text-blue-50 dark:text-navy-100">
                    "Their delivery is always on time, and the products are
                    always fresh. Highly recommended!"
                  </p>
                  <div className="flex justify-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-5 w-5 text-yellow-300"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg bg-white/10 dark:bg-navy-600/20 p-6 backdrop-blur-sm">
                <div className="relative h-16 w-16 overflow-hidden rounded-full">
                  <div className="absolute inset-0 bg-blue-300 dark:bg-navy-400 flex items-center justify-center text-blue-700 dark:text-navy-900 text-2xl font-bold">
                    RJ
                  </div>
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-bold">Robert Johnson</h3>
                  <p className="text-blue-50 dark:text-navy-100">
                    "As a cafe owner, I rely on Hayoma for consistent quality.
                    They never disappoint!"
                  </p>
                  <div className="flex justify-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-5 w-5 text-yellow-300"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 bg-gradient-to-r from-blue-50 to-white dark:from-navy-950 dark:to-gray-950">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Hayoma Dairy Company. All rights
            reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/contact"
              className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-navy-400"
            >
              Contact
            </Link>
            <Link
              href="/about"
              className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-navy-400"
            >
              About
            </Link>
            <Link
              href="#"
              className="text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-navy-400"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
