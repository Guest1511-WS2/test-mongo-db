"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, X, CheckCircle2, Loader2 } from "lucide-react";

interface Ingredient {
  _id: string;
  name: string;
  amount: number;
  unit: string;
  createdAt?: string;
}

interface EditIngredientModalProps {
  ingredient: Ingredient;
  updateIngredient: (formData: FormData) => Promise<void>;
}

export function EditIngredientModal({
  ingredient,
  updateIngredient,
}: EditIngredientModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Sync <dialog> open state
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      dialog.showModal();
      // Small delay so the modal is visible before focusing
      setTimeout(() => firstInputRef.current?.focus(), 50);
    } else {
      dialog.close();
    }
  }, [isOpen]);

  // Close on backdrop click
  function handleDialogClick(e: React.MouseEvent<HTMLDialogElement>) {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      handleClose();
    }
  }

  function handleClose() {
    if (isSubmitting) return;
    setIsOpen(false);
    setIsSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.set("id", ingredient._id);

    try {
      await updateIngredient(formData);
      setIsSuccess(true);
      // Auto-close after showing confirmation
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
      }, 1800);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* Edit trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        title={`Edit ${ingredient.name}`}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#023430]/40 bg-transparent px-2.5 py-1.5 text-xs font-medium text-[#61646B] transition-all duration-150 hover:border-[#00ED64]/60 hover:bg-[#00ED64]/10 hover:text-[#00684A] dark:border-[#023430] dark:text-[#94979E] dark:hover:border-[#00ED64]/40 dark:hover:bg-[#00ED64]/10 dark:hover:text-[#00ED64]"
      >
        <Pencil className="h-3 w-3" />
        Edit
      </button>

      {/* Native <dialog> modal */}
      <dialog
        ref={dialogRef}
        onClick={handleDialogClick}
        onCancel={(e) => {
          e.preventDefault();
          handleClose();
        }}
        className="
          w-full max-w-sm rounded-2xl border border-[#023430]
          bg-white p-0 shadow-2xl shadow-black/30
          backdrop:bg-black/60 backdrop:backdrop-blur-sm
          dark:bg-[#001E2B]
          open:animate-[modal-in_200ms_ease-out]
        "
        style={
          {
            // Ensure dialog is centered regardless of browser defaults
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            margin: 0,
          } as React.CSSProperties
        }
      >
        <div className="p-6">
          {/* Header */}
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h3 className="text-base font-semibold tracking-tight">
                Edit Ingredient
              </h3>
              <p className="mt-0.5 text-xs text-[#61646B] dark:text-[#94979E]">
                Updating{" "}
                <span className="font-medium text-[#001E2B] dark:text-white">
                  {ingredient.name}
                </span>{" "}
                in{" "}
                <code className="rounded bg-[#00ED64]/10 px-1 py-0.5 font-mono text-[#00684A] dark:text-[#00ED64]">
                  ingredientInventory
                </code>
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="ml-4 rounded-md p-1 text-[#61646B] transition-colors hover:bg-[#023430]/10 hover:text-[#001E2B] disabled:opacity-40 dark:text-[#94979E] dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Success state */}
          {isSuccess ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#00ED64]/15">
                <CheckCircle2 className="h-6 w-6 text-[#00684A] dark:text-[#00ED64]" />
              </div>
              <div>
                <p className="font-semibold tracking-tight text-[#001E2B] dark:text-white">
                  Ingredient updated!
                </p>
                <p className="mt-0.5 text-xs text-[#61646B] dark:text-[#94979E]">
                  The changes have been saved to MongoDB.
                </p>
              </div>
            </div>
          ) : (
            /* Edit form */
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor={`edit-name-${ingredient._id}`}
                  className="text-sm font-medium tracking-tight"
                >
                  Name
                </label>
                <input
                  ref={firstInputRef}
                  id={`edit-name-${ingredient._id}`}
                  name="name"
                  type="text"
                  required
                  defaultValue={ingredient.name}
                  className="rounded-lg border border-[#023430]/40 bg-white px-3.5 py-2.5 text-sm outline-none ring-[#00ED64] transition placeholder:text-[#94979E] focus:ring-2 dark:border-[#023430] dark:bg-[#001E2B] dark:text-white dark:placeholder:text-[#61646B]"
                />
              </div>

              {/* Amount + Unit */}
              <div className="flex gap-3">
                <div className="flex flex-1 flex-col gap-1.5">
                  <label
                    htmlFor={`edit-amount-${ingredient._id}`}
                    className="text-sm font-medium tracking-tight"
                  >
                    Amount
                  </label>
                  <input
                    id={`edit-amount-${ingredient._id}`}
                    name="amount"
                    type="number"
                    step="any"
                    min="0"
                    required
                    defaultValue={ingredient.amount}
                    className="rounded-lg border border-[#023430]/40 bg-white px-3.5 py-2.5 text-sm outline-none ring-[#00ED64] transition placeholder:text-[#94979E] focus:ring-2 dark:border-[#023430] dark:bg-[#001E2B] dark:text-white dark:placeholder:text-[#61646B]"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-1.5">
                  <label
                    htmlFor={`edit-unit-${ingredient._id}`}
                    className="text-sm font-medium tracking-tight"
                  >
                    Unit
                  </label>
                  <input
                    id={`edit-unit-${ingredient._id}`}
                    name="unit"
                    type="text"
                    required
                    defaultValue={ingredient.unit}
                    className="rounded-lg border border-[#023430]/40 bg-white px-3.5 py-2.5 text-sm outline-none ring-[#00ED64] transition placeholder:text-[#94979E] focus:ring-2 dark:border-[#023430] dark:bg-[#001E2B] dark:text-white dark:placeholder:text-[#61646B]"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-1 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="rounded-full border border-[#023430]/40 px-4 py-2 text-sm font-medium text-[#61646B] transition-colors hover:border-[#023430] hover:text-[#001E2B] disabled:opacity-40 dark:border-[#023430] dark:text-[#94979E] dark:hover:border-white/30 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-full bg-[#00ED64] px-5 py-2 text-sm font-semibold tracking-tight text-[#001E2B] transition-colors duration-200 hover:bg-[#00684A] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </dialog>

      {/* Keyframe for modal entrance animation */}
      <style>{`
        @keyframes modal-in {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 8px)); }
          to   { opacity: 1; transform: translate(-50%, -50%); }
        }
      `}</style>
    </>
  );
}
