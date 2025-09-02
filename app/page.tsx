import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Globe, Lock, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#07FFFF]/20 via-[#7916F3]/20 to-[#FF2670]/20"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 lg:py-32 lg:px-8">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-gray-900">
              Defy what&apos;s <span className="gradient-text">possible</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-700 animate-slide-in stagger-1">
              Mantle-Gain is a cross-chain yield aggregator that maximizes your returns by automatically allocating funds
              to the highest-yielding opportunities across multiple blockchains.
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

      {/* Feature Section */}
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight lg:text-4xl text-white">
              A future led by you
            </h2>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-400">
              Mantle-Gain is designed to maximize your returns while minimizing risks across multiple blockchains.
            </p>
          </div>
          <div className="mx-auto mt-12 sm:mt-16 lg:mt-20 max-w-2xl lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 sm:gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col animate-fade-in stagger-1">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <Globe className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                  Cross-chain optimization
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-sm sm:text-base leading-6 sm:leading-7 text-gray-400">
                  <p className="flex-auto">
                    Automatically identifies and allocates funds to the best yield opportunities across multiple
                    blockchains.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col animate-fade-in stagger-2">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <Zap className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                  Auto-rebalancing strategies
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-sm sm:text-base leading-6 sm:leading-7 text-gray-400">
                  <p className="flex-auto">
                    Dynamically moves funds based on real-time APY changes to ensure your portfolio always achieves
                    optimal returns.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col animate-fade-in stagger-3">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                  <Lock className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                  Risk assessment scoring
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-sm sm:text-base leading-6 sm:leading-7 text-gray-400">
                  <p className="flex-auto">
                    AI-powered evaluation of liquidity pools to mitigate risks and protect your investments across all
                    chains.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight lg:text-4xl text-white">
              Advanced DeFi Infrastructure
            </h2>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-gray-400">
              Discover the innovative features that power Mantle-Gain's cross-chain yield aggregation
            </p>
          </div>
          <div className="mx-auto mt-12 sm:mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-6 sm:gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <Card className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-4 sm:px-8 pb-4 sm:pb-8 pt-40 sm:pt-80 animate-fade-in stagger-1 hover:shadow-lg transition-shadow">
              <img
                src="/placeholder.svg?height=1080&width=1920"
                alt="Cross-chain technology"
                className="absolute inset-0 -z-10 h-full w-full object-cover"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
              <h3 className="mt-3 text-xl sm:text-2xl font-bold leading-6 text-white">Cross-Chain Bridging</h3>
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-6 text-gray-300">
                Seamlessly move assets between blockchains with our secure bridging technology
              </p>
            </Card>
            <Card className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-4 sm:px-8 pb-4 sm:pb-8 pt-40 sm:pt-80 animate-fade-in stagger-2 hover:shadow-lg transition-shadow">
              <img
                src="/placeholder.svg?height=1080&width=1920"
                alt="Analytics dashboard"
                className="absolute inset-0 -z-10 h-full w-full object-cover"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
              <h3 className="mt-3 text-xl sm:text-2xl font-bold leading-6 text-white">Yield Analytics</h3>
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-6 text-gray-300">
                Advanced analytics to track and optimize your yield farming performance
              </p>
            </Card>
            <Card className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-4 sm:px-8 pb-4 sm:pb-8 pt-40 sm:pt-80 animate-fade-in stagger-3 hover:shadow-lg transition-shadow">
              <img
                src="/placeholder.svg?height=1080&width=1920"
                alt="Smart contract security"
                className="absolute inset-0 -z-10 h-full w-full object-cover"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
              <h3 className="mt-3 text-xl sm:text-2xl font-bold leading-6 text-white">Smart Vaults</h3>
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-6 text-gray-300">
                Secure, automated vaults that implement complex yield strategies with minimal gas fees
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative isolate overflow-hidden bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 lg:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center animate-fade-in">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight lg:text-4xl text-white">
              Ready to maximize your yields?
            </h2>
            <p className="mx-auto mt-4 sm:mt-6 max-w-xl text-base sm:text-lg leading-7 sm:leading-8 text-gray-400">
              Start using Mantle-Gain today and experience next-generation yield aggregation
            </p>
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4 animate-slide-in stagger-1">
              <Button className="text-sm py-2 px-4 rounded-full bg-primary/90 hover:bg-primary text-white transition-colors">
                Get started
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}