export const dynamic = "force-dynamic"; // ensures dynamic server-side rendering

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText, LogIn } from "lucide-react";
import { ObjectId } from "mongodb";

import logo from "@/assets/logo.svg";
import logoDark from "@/assets/logo-dark.svg";
import vercelLogotypeLight from "@/assets/vercel-logotype-light.svg";
import vercelLogotypeDark from "@/assets/vercel-logotype-dark.svg";

import clientPromise from "@/lib/mongodb";
import { dbConnectionStatus } from "@/db/connection-status";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function Home() {
  const result = await dbConnectionStatus();

  //Connect to MongoDB
  const client = await clientPromise!;
  const db = client.db("cooking_inventory");

  // Fetch the user document by _id
  const user = await db.collection("cooking_inventory_users").findOne({
    _id: new ObjectId("507f1f77bcf86cd799439011"),
  });

  if (!user) throw new Error("User not found in MongoDB");

  const DATA = {
    title: "Next.js with MongoDB",
    description: user.username,
    button: {
      text: "Deploy to Vercel",
      href: "https://vercel.com/new/clone?repository-name=mongodb-nextjs",
    },
    link: {
      text: "View on GitHub",
      href: "https://github.com/mongodb-developer/nextjs-template-mongodb",
    },
    footerLinks: [
      { text: "Docs", href: "https://www.mongodb.com/docs/", icon: "FileText" },
      { text: "MongoDB Atlas Login", href: "https://account.mongodb.com/account/login/", icon: "LogIn" },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 md:max-w-lg md:px-0 lg:max-w-xl">

        <main className="flex flex-1 flex-col justify-center">

          <div className="flex gap-6 lg:gap-8 items-center mb-6 md:mb-7">
            <Image
              className="lg:h-8 lg:w-auto dark:hidden"
              src={logo}
              alt="MongoDB logo"
              width={88}
              height={24}
              priority
            />
            <Image
              className="hidden lg:h-8 lg:w-auto dark:block"
              src={logoDark}
              alt="MongoDB logo"
              width={88}
              height={24}
              priority
            />
            <Image
              className="lg:h-6 lg:w-auto dark:hidden"
              src={vercelLogotypeLight}
              alt="Vercel logo"
              width={88}
              height={24}
              priority
            />
            <Image
              className="hidden lg:h-6 lg:w-auto dark:block"
              src={vercelLogotypeDark}
              alt="Vercel logo"
              width={88}
              height={24}
              priority
            />
          </div>

          <h1 className="text-3xl font-semibold tracking-tighter md:text-4xl lg:text-5xl">
            {DATA.title}
          </h1>

          <p className="mt-3.5 max-w-lg text-base text-[#61646B] md:text-lg lg:text-xl dark:text-[#94979E]">
            {DATA.description} {}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Button
              asChild
              className="rounded-full bg-[#00ED64] px-5 py-2.5 font-semibold text-[#001E2B] hover:bg-[#00684A] hover:text-white"
            >
              <Link href={DATA.button.href} target="_blank">
                {DATA.button.text}
              </Link>
            </Button>

            <Button
              variant="ghost"
              asChild
              className="group flex items-center gap-2"
            >
              <Link href={DATA.link.href} target="_blank">
                {DATA.link.text}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 dark:text-white" />
              </Link>
            </Button>
          </div>
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#023430] py-5">
          <ul className="flex items-center">
            {DATA.footerLinks.map((link) => {
              const icons = { FileText, LogIn };
              const Icon = icons[link.icon as keyof typeof icons];
              return (
                <Button
                  key={link.text}
                  variant="ghost"
                  asChild
                  className="flex items-center gap-2 opacity-70 hover:opacity-100 h-auto"
                >
                  <Link href={link.href} target="_blank">
                    <Icon className="h-4 w-4 dark:text-white" />
                    <span className="text-sm">{link.text}</span>
                  </Link>
                </Button>
              );
            })}
          </ul>

          <Badge
            variant={result === "Database connected" ? "default" : "destructive"}
          >
            {result}
          </Badge>

        </footer>
      </div>
    </div>
  );
}
