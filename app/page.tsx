"use server";

import Image from "next/image";
import logo from "@/assets/logo.svg";
import logoDark from "@/assets/logo-dark.svg";
import vercelLogotypeLight from "@/assets/vercel-logotype-light.svg";
import vercelLogotypeDark from "@/assets/vercel-logotype-dark.svg";
import Link from "next/link";
import { FileText, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dbConnectionStatus } from "@/db/connection-status";
import clientPromise from "@/lib/mongodb";
import { revalidatePath } from "next/cache";

// ── Server Action ────────────────────────────────────────────────────────────
async function addIngredient(formData: FormData) {
  "use server";

  const name = formData.get("name")?.toString().trim();
  const amountRaw = formData.get("amount")?.toString().trim();
  const unit = formData.get("unit")?.toString().trim();

  if (!name || !amountRaw || !unit) return;

  const amount = parseFloat(amountRaw);
  if (isNaN(amount)) return;

  const client = await clientPromise;
  const db = client.db("cooking_inventory") | Null = client.db("cooking_inventory");
  const ingredients = db.collection("ingredientInventory") | Null = db.collection("ingredientInventory");

  await ingredients.insertOne({
    name,
    amount,
    unit,
    createdAt: new Date(),
  });

  revalidatePath("/");
}

// ── Page metadata ─────────────────────────────────────────────────────────────
const DATA = {
  title: "Next.js with MongoDB",
  description:
    "A minimal template for building full-stack React applications using Next.js, Vercel, and MongoDB.",
  button: {
    text: "Deploy to Vercel",
    href: "https://vercel.com/new/clone?repository-name=mongodb-nextjs&repository-url=https%3A%2F%2Fgithub.com%2Fmongodb-developer%2Fvercel-template-mongodb&project-name=mongodb-nextjs&demo-title=MongoDB%20%26%20Next.js%20Starter%20Template&demo-description=A%20minimal%20template%20for%20building%20full-stack%20React%20applications%20using%20Next.js%2C%20Vercel%2C%20and%20MongoDB.&demo-url=https%3A%2F%2Fnextjs.mongodb.com%2F&demo-image=https%3A%2F%2Fnextjs.mongodb.com%2Fog.png&integration-ids=oac_jnzmjqM10gllKmSrG0SGrHOH&from=templates",
  },
  link: {
    text: "View on GitHub",
    href: "https://github.com/mongodb-developer/nextjs-template-mongodb",
  },
  footerLinks: [
    {
      text: "Docs",
      href: "https://www.mongodb.com/docs/?utm_campaign=devrel&utm_source=third-party-content&utm_medium=cta&utm_content=template-nextjs-mongodb&utm_term=jesse.hall",
      icon: "FileText",
    },
    {
      text: "MongoDB Atlas Login",
      href: "https://account.mongodb.com/account/login/?utm_campaign=devrel&utm_source=third-party-content&utm_medium=cta&utm_content=template-nextjs-mongodb&utm_term=jesse.hall",
      icon: "LogIn",
    },
  ],
};

// ── Page Component ────────────────────────────────────────────────────────────
export default async function Home() {
  const result = await dbConnectionStatus();
  const isConnected = result === "Database connected";

  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 md:max-w-lg md:px-0 lg:max-w-xl">
        <main className="flex flex-1 flex-col justify-center gap-10">

          {/* ── Header / Branding ── */}
          <div>
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
            <h1 className="text-3xl font-semibold leading-none tracking-tighter md:text-4xl md:leading-none lg:text-5xl lg:leading-none">
              {DATA.title}
            </h1>
            <p className="mt-3.5 max-w-lg text-base leading-snug tracking-tight text-[#61646B] md:text-lg md:leading-snug lg:text-xl lg:leading-snug dark:text-[#94979E]">
              {DATA.description}
            </p>
          </div>

          {/* ── Add Ingredient Form ── */}
          <section className="rounded-2xl border border-[#023430] bg-[#001E2B]/5 p-6 dark:bg-[#001E2B]/40">
            <h2 className="mb-1 text-lg font-semibold tracking-tight">
              Add Ingredient
            </h2>
            <p className="mb-5 text-sm text-[#61646B] dark:text-[#94979E]">
              Insert a new ingredient into the{" "}
              <code className="rounded bg-[#00ED64]/10 px-1 py-0.5 text-xs font-mono text-[#00684A] dark:text-[#00ED64]">
                ingredientInventory
              </code>{" "}
              collection.
            </p>

            <form action={addIngredient} className="flex flex-col gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="name"
                  className="text-sm font-medium tracking-tight"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Flour"
                  className="rounded-lg border border-[#023430]/40 bg-white px-3.5 py-2.5 text-sm outline-none ring-[#00ED64] transition placeholder:text-[#94979E] focus:ring-2 dark:border-[#023430] dark:bg-[#001E2B] dark:text-white dark:placeholder:text-[#61646B]"
                />
              </div>

              {/* Amount + Unit side by side */}
              <div className="flex gap-3">
                <div className="flex flex-1 flex-col gap-1.5">
                  <label
                    htmlFor="amount"
                    className="text-sm font-medium tracking-tight"
                  >
                    Amount
                  </label>
                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    step="any"
                    min="0"
                    required
                    placeholder="e.g. 2.5"
                    className="rounded-lg border border-[#023430]/40 bg-white px-3.5 py-2.5 text-sm outline-none ring-[#00ED64] transition placeholder:text-[#94979E] focus:ring-2 dark:border-[#023430] dark:bg-[#001E2B] dark:text-white dark:placeholder:text-[#61646B]"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-1.5">
                  <label
                    htmlFor="unit"
                    className="text-sm font-medium tracking-tight"
                  >
                    Unit
                  </label>
                  <input
                    id="unit"
                    name="unit"
                    type="text"
                    required
                    placeholder="e.g. cups"
                    className="rounded-lg border border-[#023430]/40 bg-white px-3.5 py-2.5 text-sm outline-none ring-[#00ED64] transition placeholder:text-[#94979E] focus:ring-2 dark:border-[#023430] dark:bg-[#001E2B] dark:text-white dark:placeholder:text-[#61646B]"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={!isConnected}
                className="mt-1 self-start rounded-full bg-[#00ED64] px-5 py-2.5 font-semibold tracking-tight text-[#001E2B] transition-colors duration-200 hover:bg-[#00684A] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 lg:px-7 lg:py-3"
              >
                Add Ingredient
              </Button>

              {!isConnected && (
                <p className="text-xs text-red-500">
                  Database is not connected. Please check your{" "}
                  <code className="font-mono">MONGODB_URI</code> environment
                  variable.
                </p>
              )}
            </form>
          </section>
        </main>

        {/* ── Footer ── */}
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#023430] py-5 sm:gap-6 md:pb-12 md:pt-10 dark:border-[#023430]">
          <ul className="flex items-center">
            {DATA.footerLinks.map((link) => {
              const icons = { FileText, LogIn };
              const Icon = icons[link.icon as keyof typeof icons];
              return (
                <Button
                  key={link.text}
                  variant="ghost"
                  asChild
                  className="flex items-center gap-2 opacity-70 transition-opacity duration-200 hover:opacity-100 h-auto"
                >
                  <Link href={link.href} target="_blank">
                    <Icon className="h-4 w-4 dark:text-white" />
                    <span className="text-sm tracking-tight">{link.text}</span>
                  </Link>
                </Button>
              );
            })}
          </ul>

          <Badge
            variant={isConnected ? "default" : "destructive"}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              isConnected
                ? "border-[#00ED64]/20 bg-[#00ED64]/10 text-[#00684A] dark:bg-[#00ED64]/10 dark:text-[#00ED64]"
                : "border-red-500/20 bg-red-500/10 text-red-500 dark:text-red-500"
            }`}
          >
            {result}
          </Badge>
        </footer>
      </div>
    </div>
  );
}
