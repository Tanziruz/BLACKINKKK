"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";

interface BillDialogProps {
    product: Product | null;
    onClose: () => void;
}

export default function BillDialog({ product, onClose }: BillDialogProps) {
    const [customerName, setCustomerName] = useState("");
    const [nameError, setNameError] = useState("");

    function handleGenerate() {
        const trimmed = customerName.trim();
        if (!trimmed) {
            setNameError("Please enter a name.");
            return;
        }
        if (!product) return;
        generateBill(product, trimmed);
        setCustomerName("");
        setNameError("");
        onClose();
    }

    function handleOpenChange(open: boolean) {
        if (!open) {
            setCustomerName("");
            setNameError("");
            onClose();
        }
    }

    return (
        <Dialog open={!!product} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md bg-[#111] border-white/15 text-white">
                <DialogHeader>
                    <DialogTitle className="text-white text-base tracking-widest uppercase font-light">
                        Generate Bill
                    </DialogTitle>
                    <DialogDescription className="text-white/40 text-xs tracking-wide">
                        Enter the customer&apos;s name. It will appear on the generated bill.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-1.5 py-2">
                    <label className="text-white/60 text-[10px] tracking-[0.2em] uppercase">
                        Customer Name
                    </label>
                    <input
                        type="text"
                        value={customerName}
                        onChange={(e) => {
                            setCustomerName(e.target.value);
                            if (e.target.value.trim()) setNameError("");
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                        placeholder="e.g. Nasir Nawaz"
                        autoFocus
                        className="bg-white/5 border border-white/15 text-white rounded-none px-3 py-2.5 text-sm outline-none focus:border-white/50 transition-colors placeholder:text-white/20 w-full"
                    />
                    {nameError && (
                        <p className="text-red-400 text-xs">{nameError}</p>
                    )}
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                        className="bg-transparent border-white/15 text-white/50 hover:bg-white/5 hover:text-white/80 rounded-none text-xs tracking-widest uppercase"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleGenerate}
                        className="bg-white text-black hover:bg-white/90 rounded-none text-xs tracking-widest uppercase"
                    >
                        Generate Bill
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Bill HTML generation & print
// ─────────────────────────────────────────────────────────────────────────────
function generateBill(product: Product, customerName: string) {
    const now = new Date();
    const dateStr = `${now.getDate().toString().padStart(2, "0")} ${now.toLocaleString("en-GB", { month: "long" })} ${now.getFullYear()}`;

    const discount =
        product.originalPrice > product.price
            ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
            : 0;

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bill – ${customerName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', Arial, sans-serif;
      background: #fff;
      color: #111;
      padding: 48px;
      max-width: 700px;
      margin: 0 auto;
    }

    /* ── Header ── */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 1.5px solid #111;
      padding-bottom: 20px;
      margin-bottom: 32px;
    }
    .brand {
      font-size: 28px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
    .brand-sub {
      font-size: 10px;
      letter-spacing: 0.3em;
      color: #666;
      text-transform: uppercase;
      margin-top: 3px;
    }
    .bill-meta {
      text-align: right;
    }
    .bill-meta p {
      font-size: 11px;
      color: #555;
      line-height: 1.7;
    }
    .bill-meta .bill-no {
      font-size: 13px;
      font-weight: 600;
      color: #111;
    }

    /* ── Customer block ── */
    .section-label {
      font-size: 9px;
      letter-spacing: 0.25em;
      text-transform: uppercase;
      color: #999;
      margin-bottom: 4px;
    }
    .customer-name {
      font-size: 18px;
      font-weight: 500;
      letter-spacing: -0.01em;
    }
    .customer-block {
      margin-bottom: 36px;
    }

    /* ── Item table ── */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 28px;
    }
    thead tr {
      border-bottom: 1px solid #ddd;
    }
    thead th {
      font-size: 9px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #888;
      font-weight: 500;
      padding: 8px 0;
      text-align: left;
    }
    thead th:last-child { text-align: right; }
    tbody td {
      padding: 14px 0;
      border-bottom: 1px solid #f0f0f0;
      font-size: 13px;
      vertical-align: top;
    }
    tbody td:last-child { text-align: right; }
    .item-title {
      font-weight: 500;
      font-size: 14px;
    }
    .item-meta {
      font-size: 11px;
      color: #777;
      margin-top: 3px;
    }

    /* ── Totals ── */
    .totals {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 6px;
      margin-bottom: 40px;
    }
    .totals .row {
      display: flex;
      gap: 40px;
      font-size: 12px;
      color: #555;
    }
    .totals .row .label { min-width: 100px; text-align: right; }
    .totals .row .val { min-width: 80px; text-align: right; }
    .totals .total-row {
      display: flex;
      gap: 40px;
      font-size: 16px;
      font-weight: 600;
      color: #111;
      border-top: 1.5px solid #111;
      padding-top: 10px;
      margin-top: 4px;
    }
    .totals .total-row .label { min-width: 100px; text-align: right; }
    .totals .total-row .val { min-width: 80px; text-align: right; }

    /* ── Footer ── */
    .footer {
      border-top: 1px solid #eee;
      padding-top: 20px;
      text-align: center;
    }
    .footer p {
      font-size: 10px;
      color: #aaa;
      letter-spacing: 0.04em;
      line-height: 1.8;
    }

    @media print {
      body { padding: 24px; }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="header">
    <div>
      <div class="brand">BLACKINKKK</div>
      <div class="brand-sub">Premium Apparel</div>
    </div>
    <div class="bill-meta">
      <p class="bill-no">INVOICE</p>
      <p>Date: ${dateStr}</p>
      <p>SKU: ${product.id}</p>
    </div>
  </div>

  <!-- Customer -->
  <div class="customer-block">
    <div class="section-label">Billed To</div>
    <div class="customer-name">${escapeHtml(customerName)}</div>
  </div>

  <!-- Items table -->
  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th style="text-align:right">MRP</th>
        <th style="text-align:right">Price</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div class="item-title">${escapeHtml(product.title)}</div>
          ${product.category ? `<div class="item-meta">${escapeHtml(product.category)}</div>` : ""}
          ${discount > 0 ? `<div class="item-meta">${discount}% off</div>` : ""}
        </td>
        <td>
          ${product.originalPrice > product.price
            ? `<span style="text-decoration:line-through;color:#aaa">₹${product.originalPrice}</span>`
            : `₹${product.originalPrice}`}
        </td>
        <td><strong>₹${product.price}</strong></td>
      </tr>
    </tbody>
  </table>

  <!-- Totals -->
  <div class="totals">
    ${discount > 0
        ? `<div class="row"><span class="label">MRP</span><span class="val">₹${product.originalPrice}</span></div>
           <div class="row"><span class="label">Discount (${discount}%)</span><span class="val" style="color:#22c55e">– ₹${product.originalPrice - product.price}</span></div>`
        : ""}
    <div class="total-row"><span class="label">Total</span><span class="val">₹${product.price}</span></div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <p>Thank you for shopping with BLACKINKKK</p>
    <p>Ghaziabad, Uttar Pradesh, India 201001 &nbsp;|&nbsp; blackinkkk@aol.com &nbsp;|&nbsp; +91 98103 67883</p>
    <p style="margin-top:8px;color:#ccc">Payment by UPI only &nbsp;·&nbsp; No COD available</p>
  </div>

  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`;

    const win = window.open("", "_blank");
    if (win) {
        win.document.write(html);
        win.document.close();
    } else {
        alert(
            "Pop-up blocked! Please allow pop-ups for this site and try again."
        );
    }
}

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
