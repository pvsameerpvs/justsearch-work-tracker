"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Link2, Loader2, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

type StatusId =
  | "PENDING"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "COMPLETED"
  | "DELIVERED";

const EXECUTIVES = [
  { id: "EMP001", name: "Fathima Nida" },
  { id: "EMP002", name: "Alphonsa" },
  { id: "EMP003", name: "Ali" },
  { id: "EMP004", name: "Sameer" },
  { id: "EMP005", name: "Vishnu" },
  { id: "EMP006", name: "Shon" }
] as const;

const STATUSES = [
  { id: "PENDING", label: "Pending" },
  { id: "IN_PROGRESS", label: "In Progress" },
  { id: "IN_REVIEW", label: "In Review" },
  { id: "COMPLETED", label: "Completed" },
  { id: "DELIVERED", label: "Delivered" }
] as const;

export default function HomePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>();
  const [executiveId, setExecutiveId] = useState<
    (typeof EXECUTIVES)[number]["id"] | undefined
  >();
  const [companyName, setCompanyName] = useState("");
  const [product, setProduct] = useState("");
  const [statusId, setStatusId] = useState<StatusId>("PENDING");
  const [comments, setComments] = useState("");
  const [websiteLink, setWebsiteLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({ type: null, text: "" });

  const webhookUrl =
    process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ||
    "https://shon555.app.n8n.cloud/webhook-test/e0cb3c43-2a2b-4f05-a8e4-1036baa42dab";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitMessage({ type: null, text: "" });

    if (!date || !executiveId || !companyName || !product || !statusId) {
      setSubmitMessage({
        type: "error",
        text: "Please fill in all required fields (Date, Executive, Company, Product, Status)."
      });
      return;
    }

    if (!websiteLink) {
      setSubmitMessage({
        type: "error",
        text: "Please provide the Website Link."
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const exec = EXECUTIVES.find((e) => e.id === executiveId)!;
      const status = STATUSES.find((s) => s.id === statusId)!;

      // Optional unique ID per row
      const entryId = `JS-${Date.now()}`;

      const payload = {
        entryId, // unique ID for this log

        date: format(date, "yyyy-MM-dd"),

        executiveId: exec.id,
        executiveName: exec.name,

        companyName,
        product,

        statusId: status.id,
        statusLabel: status.label,

        deliveryDate: deliveryDate ? format(deliveryDate, "yyyy-MM-dd") : "",
        comments,
        websiteLink
      };

      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Webhook responded with status ${res.status}`);
      }

      setSubmitMessage({
        type: "success",
        text: "Work log submitted successfully! Your entry has been sent to n8n / Google Sheets."
      });

      // Reset form except date & executive for faster multiple entries
      setCompanyName("");
      setProduct("");
      setStatusId("PENDING");
      setDeliveryDate(undefined);
      setComments("");
      setWebsiteLink("");
    } catch (error: any) {
      console.error(error);
      setSubmitMessage({
        type: "error",
        text:
          "Something went wrong while sending data to the n8n webhook. Please check the webhook URL and try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl">
        <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-slate-500">
              JustSearch
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Employee Work Tracker
            </h1>
            <p className="mt-2 text-sm text-slate-600 max-w-xl">
              Log client activities, delivery status, and website links.
              Submissions are forwarded to{" "}
              <span className="font-semibold">n8n</span> and stored in{" "}
              <span className="font-semibold">Google Sheets</span>.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-xs text-slate-100 shadow-soft">
            <div className="flex h-7 w-7 items-center justify-center rounded-2xl bg-slate-800">
              <Link2 className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">Connected to n8n</p>
              <p className="text-[0.7rem] text-slate-300">
                POST JSON → webhook → Google Sheets
              </p>
            </div>
          </div>
        </header>

        <section className="rounded-3xl bg-white/90 p-6 shadow-soft backdrop-blur-sm sm:p-8 border border-slate-100">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            {/* Date */}
            <div className="flex flex-col gap-1.5">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !date && "text-slate-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                    {date ? format(date, "dd MMM yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-[0.7rem] text-slate-500">
                The day this activity is being logged.
              </p>
            </div>

            {/* Executive Name */}
            <div className="flex flex-col gap-1.5">
              <Label>Executive Name *</Label>
              <Select
                value={executiveId}
                onValueChange={(value) =>
                  setExecutiveId(
                    value as (typeof EXECUTIVES)[number]["id"]
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select executive" />
                </SelectTrigger>
                <SelectContent>
                  {EXECUTIVES.map((exe) => (
                    <SelectItem key={exe.id} value={exe.id}>
                      {exe.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Company Name */}
            <div className="flex flex-col gap-1.5">
              <Label>Company Name *</Label>
              <Input
                placeholder="Client company name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            {/* Product */}
            <div className="flex flex-col gap-1.5">
              <Label>Product / Service *</Label>
              <Input
                placeholder="What are you working on?"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
              />
            </div>

            {/* Status */}
            <div className="flex flex-col gap-1.5">
              <Label>Status *</Label>
              <Select
                value={statusId}
                onValueChange={(value) => setStatusId(value as StatusId)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((st) => (
                    <SelectItem key={st.id} value={st.id}>
                      {st.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Delivery Date */}
            <div className="flex flex-col gap-1.5">
              <Label>Delivery Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !deliveryDate && "text-slate-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
                    {deliveryDate
                      ? format(deliveryDate, "dd MMM yyyy")
                      : "Select delivery date (optional)"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                  <Calendar
                    mode="single"
                    selected={deliveryDate}
                    onSelect={setDeliveryDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <p className="text-[0.7rem] text-slate-500">
                When the work is expected to be delivered or was delivered.
              </p>
            </div>

            {/* Website Link */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <Label>Website Link *</Label>
              <Input
                placeholder="https://example.com"
                type="url"
                value={websiteLink}
                onChange={(e) => setWebsiteLink(e.target.value)}
              />
            </div>

            {/* Comments */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <Label>Comments / Notes</Label>
              <Textarea
                placeholder="Add any extra notes about deliverables, feedback, or next steps..."
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>

            {/* Footer actions */}
            <div className="md:col-span-2 mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              {submitMessage.type && (
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-2xl px-3 py-2 text-xs",
                    submitMessage.type === "success"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  )}
                >
                  <CheckCircle2
                    className={cn(
                      "h-4 w-4",
                      submitMessage.type === "success"
                        ? "text-emerald-600"
                        : "text-red-600"
                    )}
                  />
                  <p>{submitMessage.text}</p>
                </div>
              )}

              <div className="flex items-center gap-2 sm:ml-auto">
                <p className="text-[0.7rem] text-slate-500">
                  Required fields are marked with *
                </p>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="shadow-soft"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Work Log"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </section>

        <footer className="mt-6 text-[0.7rem] text-slate-500">
          <p>
            Tip: set{" "}
            <code className="rounded bg-slate-900 px-1.5 py-0.5 text-[0.65rem] text-slate-100">
              NEXT_PUBLIC_N8N_WEBHOOK_URL
            </code>{" "}
            in your <code>.env.local</code> file to point at your n8n webhook.
          </p>
        </footer>
      </div>
    </main>
  );
}
