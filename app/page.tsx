import { CardBody, CardContainer, CardItem } from "@/components/global/3d-card";
import { HeroParallax } from "@/components/global/connect-parallax";
import { ContainerScroll } from "@/components/global/container-scroll-animation";
import { InfiniteMovingCards } from "@/components/global/infinite-moving-cards";
import { LampComponent } from "@/components/global/lamp";
import Navbar from "@/components/global/navbar";
import { Button } from "@/components/ui/button";
import { clients, products } from "@/lib/constant";
import { CheckIcon, Sparkles } from "lucide-react";
import Image from "next/image";
import Footer from "@/components/global/Footer";

export default function Home() {
  return <main>
    <Navbar />
    <section className="h-screen w-full  bg-neutral-950 rounded-md  !overflow-visible relative flex flex-col items-center  antialiased">
    <div className="absolute inset-0 min-h-[120vh] w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_35%,#223_100%)]"></div>
      <div className="flex flex-col mt-[-100px] md:mt-[-50px]">
      <ContainerScroll
            titleComponent={
              <div className="flex items-center flex-col">
                <Button
                  size={'lg'}
                  className="p-8 mb-8 md:mb-0 text-2xl w-full sm:w-fit border-t-2 rounded-full border-[#4D4D4D] bg-[#1F1F1F] hover:bg-white group transition-all flex items-center justify-center gap-4 hover:shadow-xl hover:shadow-neutral-500 duration-500"
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-500 to-neutral-600  md:text-center font-sans group-hover:bg-gradient-to-r group-hover:from-black goup-hover:to-black">
                    Start For Free Today
                  </span>
                </Button>
                <h1 className="text-5xl md:text-8xl  bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-600 font-sans font-bold">
                  Your expenses, simplified.
                </h1>
              </div>
            }
          />
      </div>
    </section>
    <div className="mt-40 md:mt-96 sm:mb-16">
        <InfiniteMovingCards
          className="md:mt-0"
          items={clients}
          direction="right"
          speed="slow"
        />
      </div>
      <section>
        <HeroParallax products={products}></HeroParallax>
      </section>
      <section className="mt-[-500px]">
        <LampComponent />
        <div className="flex flex-wrap items-center justify-center flex-col md:flex-row gap-20 md:p-20 -mt-72">
          <CardContainer className="inter-var ">
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-neutral-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full md:!w-[350px] h-auto rounded-xl p-6 border">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-600 dark:text-white "
              >
                
                <h2 className="text-3xl text-center">Smart Expense Tracking</h2>
              </CardItem>
              <CardItem
                translateZ="60"
                className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
              >
                Automatically categorize your expenses, track them in real-time, and get weekly insights on your spending habits.
                <ul className="my-4 flex flex-col gap-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon />Auto-categorization of expenses
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon />
                    Real-time sync
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon />
                    Weekly insights & summaries
                  </li>
                </ul>
              </CardItem>
            </CardBody>
          </CardContainer>
          <CardContainer className="inter-var ">
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-neutral-500/[0.1] dark:bg-black dark:border-[#E2CBFF] border-black/[0.1] w-full md:!w-[350px] h-auto rounded-xl p-6 border">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-600 dark:text-white "
              >
                <h2 className="text-3xl text-center">Interactive Dashboards</h2>
              </CardItem>
              <CardItem
                translateZ="60"
                className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
              >
                  Visualize your financial data through stunning graphs and charts to understand your finances at a glance.
                <ul className="my-4 flex flex-col gap-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon />Category-wise income & expenditure breakdown with bar & pie charts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon />
                    Budget progress tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon />
                    Monthly/yearly history with bar charts & tooltips
                  </li>
                </ul>
              </CardItem>
            </CardBody>
          </CardContainer>
          <CardContainer className="inter-var ">
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-neutral-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full md:!w-[350px] h-auto rounded-xl p-6 border">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-600 dark:text-white "
              >
                <h2 className="text-3xl text-center">Efficient Budget Planning</h2>
              </CardItem>
              <CardItem
                translateZ="60"
                className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
              >
                  Set monthly budgets for categories and stay on top of your financial goals with smart recommendations.
                <ul className="my-4 flex flex-col gap-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon />Set and edit monthly or yearly limits
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon />
                    Color based limit visualisations
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon />
                    Alerts when nearing limits
                  </li>
                </ul>
              </CardItem>
            </CardBody>
          </CardContainer>
          <CardContainer className="inter-var ">
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-neutral-500/[0.1] dark:bg-black dark:border-[#E2CBFF] border-black/[0.1] w-full md:!w-[350px] h-auto rounded-xl p-6 border">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-600 dark:text-white "
              >
                
                <h2 className="text-3xl text-center">Powerful & Secure Transactions</h2>
              </CardItem>
              <CardItem
                translateZ="60"
                className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
              >
                Create, manage, and track your transactions with full control and bulletproof privacy.
                <ul className="my-4 flex flex-col gap-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon />Add transactions with description, amount, category & date
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon />
                    Create categories with custom name, icon, type, and budget
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon />
                    End-to-end encrypted with UTC-based timestamping
                  </li>
                </ul>
              </CardItem>
            </CardBody>
          </CardContainer>
          <CardContainer className="inter-var">
            <CardBody className="relative group/card w-full md:!w-[350px] h-auto rounded-xl p-6 border border-black/[0.1] dark:border-white/[0.2] bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 text-white dark:text-white shadow-md hover:shadow-2xl transition-all duration-300">
              <CardItem
                translateZ="50"
                className="text-xl font-bold flex items-center gap-2 mb-2"
              >
                <Sparkles className="w-8 h-8" />
                <h2 className="text-3xl font-semibold">AI Receipt Scan</h2>
              </CardItem>
              <CardItem
                translateZ="60"
                className="text-sm max-w-sm mt-2"
              >
                Let AI do the heavy lifting—just upload your receipt, and the system intelligently extracts and organizes transaction details for you. No more manual data entry.
                <ul className="my-4 flex flex-col gap-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon /> Smart OCR extracts amount, date, category, and description
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon /> Auto-assigns categories based on past patterns
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon /> Supports image and PDF uploads with high accuracy
                  </li>
                </ul>
              </CardItem>
            </CardBody>
          </CardContainer>

          <CardContainer className="inter-var ">
            <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-neutral-500/[0.1] dark:bg-black dark:border-[#E2CBFF] border-black/[0.1] w-full md:!w-[350px] h-auto rounded-xl p-6 border">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-600 dark:text-white "
              >
                <h2 className="text-3xl text-center">Full Control over your Utilities</h2>
              </CardItem>
              <CardItem
                translateZ="60"
                className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
              >
                All the features you need to manage your budget with flexibility and precision.
                <ul className="my-4 flex flex-col gap-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon />Edit/delete your transactions and categories
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon />
                    Export transactions data as CSV with selective filtering
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon />
                    Date range picker for transactions & currency toggle
                  </li>
                </ul>
              </CardItem>
            </CardBody>
          </CardContainer>
          
        </div>
      </section>
      <Footer />
  </main>
}
