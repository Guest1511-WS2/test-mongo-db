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
import { ObjectId } from "mongodb";
import { EditIngredientModal } from "@/components/ui/EditIngredientModal";

// Connecting to the Server
async function addIngredient(formData: FormData) {
  "use server";

  const name = formData.get("name")?.toString().trim();
  const amountRaw = formData.get("amount")?.toString().trim();
  const statusRaw = formData.get("status")?.toString().trim();
  const unit = formData.get("unit")?.toString().trim();

  if (!name || !amountRaw || !statusRaw !! !unit) return;

  const amount = parseFloat(amountRaw);
  if (isNaN(amount)) return;

  if (!clientPromise) throw new Error("Database client not initialized");

  const client = await clientPromise;
  const db = client.db("cooking_inventory");
  const ingredients = db.collection("ingredientInventory");

  await ingredients.insertOne({
    name,
    amount,
    status,
    unit,
    createdAt: new Date(),
  });

  revalidatePath("/");
}

async function updateIngredient(formData: FormData) {
  "use server";

  const id = formData.get("id")?.toString().trim();
  const name = formData.get("name")?.toString().trim();
  const amountRaw = formData.get("amount")?.toString().trim();
  const statusRaw = formData.get("status")?.toString().trim();
  const unit = formData.get("unit")?.toString().trim();

  if (!id || !name || !amountRaw || !statusRaw || !unit) return;

  const amount = parseFloat(amountRaw);
  if (isNaN(amount)) return;

  if (!clientPromise) throw new Error("Database client not initialized");

  const client = await clientPromise;
  const db = client.db("cooking_inventory");
  const ingredients = db.collection("ingredientInventory");

  await ingredients.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        name,
        amount,
        status,
        unit,
        updatedAt: new Date(),
      },
    }
  );

  revalidatePath("/");
}

// Setting up the page
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

// interface dataTypes
interface Ingredient {
  _id: string;
  name: string;
  amount: number;
  status: string;
  unit: string;
  createdAt?: string;
}

// Page Logic
export default async function Home() {
  const result = await dbConnectionStatus();
  const isConnected = result === "Database connected";

  let ingredients: Ingredient[] = [];
  if (isConnected && clientPromise) {
    const client = await clientPromise;
    const db = client.db("cooking_inventory");
    const raw = await db
      .collection("ingredientInventory")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    ingredients = raw.map((doc) => ({
      _id: doc._id.toString(),
      name: doc.name ?? "",
      amount: doc.amount ?? 0,
      status: doc.status ?? "",
      unit: doc.unit ?? "",
      createdAt: doc.createdAt ? new Date(doc.createdAt).toLocaleString() : undefined,
    }));
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col px-5 md:max-w-lg md:px-0 lg:max-w-xl">
        <main className="flex flex-1 flex-col justify-center gap-10">

          {/* Form Header/Footer */}
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

          {/* Add Ingredient Form */}
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

              {/* Amount + Unit*/}
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
              
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="name"
                  className="text-sm font-medium tracking-tight"
                >
                  Status
                </label>
                <input
                  id="status"
                  name="status"
                  type="text"
                  required
                  placeholder="e.g. Low/In Stock/etc."
                  className="rounded-lg border border-[#023430]/40 bg-white px-3.5 py-2.5 text-sm outline-none ring-[#00ED64] transition placeholder:text-[#94979E] focus:ring-2 dark:border-[#023430] dark:bg-[#001E2B] dark:text-white dark:placeholder:text-[#61646B]"
                />
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

          {/* Ingredient Table */}
          <section className="rounded-2xl border border-[#023430] bg-[#001E2B]/5 p-6 dark:bg-[#001E2B]/40">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">
                Ingredient Inventory
              </h2>
              <Badge className="rounded-full px-2.5 py-1 text-xs font-semibold border-[#00ED64]/20 bg-[#00ED64]/10 text-[#00684A] dark:text-[#00ED64]">
                {ingredients.length} {ingredients.length === 1 ? "item" : "items"}
              </Badge>
            </div>

            {ingredients.length === 0 ? (
              <p className="py-6 text-center text-sm text-[#61646B] dark:text-[#94979E]">
                No ingredients yet. Add one above to get started.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#023430]/40 dark:border-[#023430]">
                      <th className="pb-2.5 pr-4 text-left font-semibold tracking-tight text-[#61646B] dark:text-[#94979E]">Name</th>
                      <th className="pb-2.5 pr-4 text-left font-semibold tracking-tight text-[#61646B] dark:text-[#94979E]">Amount</th>
                      <th className="pb-2.5 pr-4 text-left font-semibold tracking-tight text-[#61646B] dark:text-[#94979E]">Status</th>
                      <th className="pb-2.5 pr-4 text-left font-semibold tracking-tight text-[#61646B] dark:text-[#94979E]">Unit</th>
                      <th className="pb-2.5 pr-4 text-left font-semibold tracking-tight text-[#61646B] dark:text-[#94979E]">Added</th>
                      <th className="pb-2.5 text-right font-semibold tracking-tight text-[#61646B] dark:text-[#94979E]">Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredients.map((ingredient, idx) => (
                      <tr
                        key={ingredient._id}
                        className={`border-b border-[#023430]/20 last:border-0 dark:border-[#023430]/60 ${
                          idx === 0 ? "bg-[#00ED64]/5 dark:bg-[#00ED64]/5" : ""
                        }`}
                      >
                        <td className="py-3 pr-4 font-medium">
                          {idx === 0 && (
                            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-[#00ED64] align-middle" />
                          )}
                          {ingredient.name}
                        </td>
                        <td className="py-3 pr-4 tabular-nums text-[#61646B] dark:text-[#94979E]">{ingredient.amount}</td>
                        <td className="py-3 pr-4 tabular-nums text-[#61646B] dark:text-[#94979E]">{ingredient.status}</td>
                        <td className="py-3 pr-4 text-[#61646B] dark:text-[#94979E]">{ingredient.unit}</td>
                        <td className="py-3 pr-4 text-xs text-[#61646B] dark:text-[#94979E]">{ingredient.createdAt ?? "—"}</td>
                        <td className="py-3 text-right">
                          <EditIngredientModal
                            ingredient={ingredient}
                            updateIngredient={updateIngredient}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>

        {/* Ingredient Inventory Footer */}
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
