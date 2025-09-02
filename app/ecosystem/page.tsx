import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Globe, Database } from "lucide-react"

export const metadata: Metadata = {
  title: "Ecosystem | Mantle-Gain",
  description: "Explore the Mantle-Gain ecosystem of protocols, integrations, and partnerships.",
}

export default function Ecosystem() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#07FFFF]/10 via-[#7916F3]/10 to-[#FF2670]/10"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 lg:py-32 lg:px-8">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-gray-900">
              The <span className="gradient-text">Ecosystem</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-700 animate-slide-in stagger-1">
              Discover the interconnected network of protocols, chains, and partners that power Mantle-Gain's cross-chain
              yield optimization platform.
            </p>
          </div>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block">
          <div className="relative h-[400px] w-[400px]">
            <div className="absolute top-0 left-0 h-16 w-16 rounded-full bg-[#FF2670] opacity-40 animate-float"></div>
            <div
              className="absolute top-1/4 right-1/4 h-24 w-24 rounded-full bg-[#07FFFF] opacity-30 animate-float"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute bottom-1/3 left-1/3 h-20 w-20 rounded-full bg-[#E4FF07] opacity-30 animate-float"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute bottom-0 right-0 h-16 w-16 rounded-full bg-[#7916F3] opacity-40 animate-float"
              style={{ animationDelay: "1.5s" }}
            ></div>
          </div>
        </div>
      </section>

      {/* Blockchains Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary animate-fade-in">Supported Blockchains</h2>
            <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight lg:text-4xl text-gray-900 animate-fade-in stagger-1">
              Truly cross-chain
            </p>
          </div>
          <div className="mx-auto mt-12 sm:mt-16 lg:mt-20 max-w-2xl lg:max-w-none">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {[
                { 
                  name: "Ethereum", 
                  logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
                  delay: 0.1 
                },
                { 
                  name: "Binance Smart Chain", 
                  logo: "https://cryptologos.cc/logos/bnb-bnb-logo.png",
                  delay: 0.2 
                },
                { 
                  name: "Polkadot", 
                  logo: "https://cryptologos.cc/logos/polkadot-new-dot-logo.png",
                  delay: 0.3 
                },
                { 
                  name: "Avalanche", 
                  logo: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
                  delay: 0.4 
                },
                { 
                  name: "Solana", 
                  logo: "https://cryptologos.cc/logos/solana-sol-logo.png",
                  delay: 0.5 
                },
                { 
                  name: "Polygon", 
                  logo: "https://cryptologos.cc/logos/polygon-matic-logo.png",
                  delay: 0.6 
                },
                { 
                  name: "Mantle", 
                  logo: "https://altcoinsbox.com/wp-content/uploads/2023/03/mantle-mnt-logo.webp",
                  delay: 0.7 
                },
              ].map((chain) => (
                <div
                  key={chain.name}
                  className="flex flex-col items-center animate-fade-in"
                  style={{ animationDelay: `${chain.delay}s` }}
                >
                  <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <img 
                        src={chain.logo} 
                        alt={chain.name} 
                        className="h-6 w-6 sm:h-8 sm:w-8 object-contain" 
                      />
                    </div>
                  </div>
                  <p className="mt-2 sm:mt-4 text-xs sm:text-sm font-medium text-gray-900 text-center">{chain.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Overview */}
      <section className="py-16 sm:py-24 lg:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-primary animate-fade-in">Ecosystem Overview</h2>
            <p className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight lg:text-4xl text-gray-900 animate-fade-in stagger-1">
              A unified cross-chain experience
            </p>
          </div>
          <div className="mx-auto mt-12 sm:mt-16 lg:mt-20 max-w-2xl lg:max-w-none">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
              <Card className="flex flex-col overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-shadow animate-fade-in stagger-1">
                <CardContent className="flex flex-1 flex-col p-4 sm:p-6">
                  <div className="flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Globe className="h-5 sm:h-6 w-5 sm:w-6" />
                  </div>
                  <div className="mt-4 sm:mt-6">
                    <h3 className="text-base sm:text-lg font-semibold leading-7 sm:leading-8 text-gray-900">
                      Supported Blockchains
                    </h3>
                    <p className="mt-2 sm:mt-4 text-sm leading-6 sm:leading-7 text-gray-600">
                      Mantle-Gain operates across multiple blockchains, enabling users to access yield opportunities
                      wherever they exist.
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card className="flex flex-col overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-shadow animate-fade-in stagger-2">
                <CardContent className="flex flex-1 flex-col p-4 sm:p-6">
                  <div className="flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Database className="h-5 sm:h-6 w-5 sm:w-6" />
                  </div>
                  <div className="mt-4 sm:mt-6">
                    <h3 className="text-base sm:text-lg font-semibold leading-7 sm:leading-8 text-gray-900">
                      Integrated Protocols
                    </h3>
                    <p className="mt-2 sm:mt-4 text-sm leading-6 sm:leading-7 text-gray-600">
                      We integrate with leading DeFi protocols to source the best yield opportunities for our users,
                      including those in the Mantle ecosystem with its $200M EcoFund.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 lg:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight lg:text-4xl text-gray-900">
              Ready to optimize your cross-chain yield?
            </h2>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-600">
              Join thousands of users already earning with Mantle-Gain.
            </p>
            <div className="mt-8 flex items-center justify-center gap-x-6">
              <Button className="rounded-md bg-primary px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Link href="/learn" className="text-sm sm:text-base font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}