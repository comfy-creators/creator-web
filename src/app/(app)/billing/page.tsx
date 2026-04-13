/** @format */

"use client";

/** @format */

import { CoinsIcon, ExternalLinkIcon, PlusIcon } from "lucide-react";

import { useCreditBalance } from "@/hooks/use-credit-balance";
import { useTransactionHistory } from "@/hooks/use-transaction-history";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function BillingPage() {
  const { totalCredits, isLoading: loadingCredits } = useCreditBalance();
  const { data: transactions, isLoading: loadingTx } = useTransactionHistory();

  function handleBuyCredits() {
    // TODO: redirect to Stripe checkout once the billing endpoint is available
    alert("Stripe checkout coming soon!");
  }

  return (
    <>
      <div>
        <h1 className="text-xl font-semibold">Billing</h1>
        <p className="text-sm text-muted-foreground">
          Manage your credits and purchases
        </p>
      </div>

      {/* Balance hero */}
      <Card>
        <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CoinsIcon className="size-6" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Current balance</p>
              {loadingCredits ? (
                <Skeleton className="mt-1 h-8 w-24" />
              ) : (
                <p className="text-3xl font-semibold tabular-nums">
                  {totalCredits?.toLocaleString() ?? "—"}
                  <span className="ml-1.5 text-base font-normal text-muted-foreground">
                    credits
                  </span>
                </p>
              )}
            </div>
          </div>
          <Button onClick={handleBuyCredits}>
            <PlusIcon data-icon="inline-start" />
            Buy Credits
          </Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Transaction history */}
      <div>
        <h2 className="mb-3 text-sm font-medium">Transaction History</h2>
        <Card>
          <CardContent className="p-0">
            {loadingTx ? (
              <div className="flex flex-col gap-3 p-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-full" />
                ))}
              </div>
            ) : !transactions?.length ? (
              <div className="flex flex-col items-center gap-1.5 py-14 text-center text-muted-foreground">
                <CoinsIcon className="size-7 opacity-40" />
                <p className="text-sm">No transactions yet.</p>
                <p className="text-xs opacity-70">
                  Purchases and generation costs will appear here.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="text-xs">
                        {tx.description}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            tx.type === "credit_purchase"
                              ? "secondary"
                              : "outline"
                          }
                          className={
                            tx.type === "credit_purchase"
                              ? "border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400"
                              : ""
                          }
                        >
                          {tx.type === "credit_purchase" ? "Purchase" : "Spend"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell
                        className={[
                          "text-right tabular-nums text-xs font-medium",
                          tx.type === "credit_purchase"
                            ? "text-green-700 dark:text-green-400"
                            : "text-muted-foreground",
                        ].join(" ")}
                      >
                        {tx.type === "credit_purchase" ? "+" : "-"}
                        {tx.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
