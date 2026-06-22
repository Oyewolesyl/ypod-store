"use client";

import { useMemo, useState } from "react";
import { formatNaira, useCart } from "@/lib/shop/cart";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

const preorderWallet = process.env.NEXT_PUBLIC_PREORDER_WALLET ?? "0x5B014E95ebA24F348528cBF8eE680f95a94cb64E";
const preorderChainId = process.env.NEXT_PUBLIC_PREORDER_CHAIN_ID ?? "0x1";
const preorderChainName = process.env.NEXT_PUBLIC_PREORDER_CHAIN_NAME ?? "ethereum";
const usdtWallet = process.env.NEXT_PUBLIC_USDT_WALLET ?? preorderWallet;
const usdtContract = process.env.NEXT_PUBLIC_USDT_CONTRACT ?? "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const usdtChainId = process.env.NEXT_PUBLIC_USDT_CHAIN_ID ?? "0x1";
const btcWallet = process.env.NEXT_PUBLIC_BTC_WALLET ?? "bc1qun3s0pw5r3cura2fls04rex95jlcr88drz5rre";
const bankName = process.env.NEXT_PUBLIC_BANK_NAME ?? "";
const bankAccountName = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME ?? "";
const bankAccountNumber = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER ?? "";
const preorderPaymentMode = process.env.NEXT_PUBLIC_PREORDER_PAYMENT_MODE ?? "full";
const preorderDepositNaira = Number(process.env.NEXT_PUBLIC_PREORDER_DEPOSIT_NAIRA ?? "0");
const nairaPerEth = Number(process.env.NEXT_PUBLIC_NAIRA_PER_ETH ?? "0");
const nairaPerUsdt = Number(process.env.NEXT_PUBLIC_NAIRA_PER_USDT ?? "0");

function isValidHexAddress(value: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(value);
}

function toHexQuantity(value: string) {
  return value.startsWith("0x") ? value : `0x${BigInt(value).toString(16)}`;
}

function toTokenUnits(amountNaira: number, nairaPerToken: number, decimals: number) {
  if (!Number.isFinite(amountNaira) || amountNaira <= 0 || !Number.isFinite(nairaPerToken) || nairaPerToken <= 0) {
    return "";
  }

  const tokenAmount = amountNaira / nairaPerToken;
  return BigInt(Math.ceil(tokenAmount * 10 ** decimals)).toString();
}

function encodeErc20Transfer(to: string, amountUnits: string) {
  const methodId = "a9059cbb";
  const paddedAddress = to.toLowerCase().replace(/^0x/, "").padStart(64, "0");
  const paddedAmount = BigInt(amountUnits).toString(16).padStart(64, "0");
  return `0x${methodId}${paddedAddress}${paddedAmount}`;
}

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCart();
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [btcTxHash, setBtcTxHash] = useState("");
  const [bankReference, setBankReference] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const orderSummary = useMemo(
    () =>
      items.map((item) => ({
        productId: item.productId,
        name: item.name,
        color: item.color,
        wrap: item.wrap,
        quantity: item.quantity,
        priceValue: item.priceValue,
      })),
    [items],
  );

  const preorderAmountNaira = useMemo(() => {
    if (preorderPaymentMode === "deposit" && Number.isFinite(preorderDepositNaira) && preorderDepositNaira > 0) {
      return Math.min(subtotal, preorderDepositNaira);
    }

    return subtotal;
  }, [subtotal]);

  const ethAmountWei = useMemo(() => toTokenUnits(preorderAmountNaira, nairaPerEth, 18), [preorderAmountNaira]);
  const usdtAmountUnits = useMemo(() => toTokenUnits(preorderAmountNaira, nairaPerUsdt, 6), [preorderAmountNaira]);
  const canPayEth = Boolean(items.length && ethAmountWei && preorderWallet && isValidHexAddress(preorderWallet));
  const canPayUsdt = Boolean(items.length && usdtAmountUnits && isValidHexAddress(usdtWallet) && isValidHexAddress(usdtContract));
  const canUseBank = Boolean(items.length && bankName && bankAccountName && bankAccountNumber);

  if (!isOpen) {
    return null;
  }

  async function reservePreorder(payment?: {
    txHash?: string;
    paymentWallet?: string;
    paymentAmountWei?: string;
    paymentAmountUnits?: string;
    paymentChainId?: string;
    paymentMethod?: string;
    paymentAsset?: string;
  }) {
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/preorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, items: orderSummary, subtotal, walletAddress, ...payment }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message ?? "could not reserve preorder.");
      }

      setStatus("success");
      setMessage(payment?.paymentAsset ? `payment preorder saved: ${data.reference}` : `preorder reserved: ${data.reference}`);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "could not reserve preorder.");
    }
  }

  async function connectWallet() {
    if (!window.ethereum) {
      setStatus("error");
      setMessage("wallet not found. install a wallet or use email preorder for now.");
      return;
    }

    const accounts = (await window.ethereum.request({ method: "eth_requestAccounts" })) as string[];
    setWalletAddress(accounts[0] ?? "");
  }

  function validatePaymentStart() {
    setStatus("loading");
    setMessage("");

    if (!items.length) {
      setStatus("error");
      setMessage("add a product before starting wallet preorder.");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("enter a valid email before wallet preorder.");
      return false;
    }

    if (!window.ethereum) {
      setStatus("error");
      setMessage("wallet not found. open this in trust wallet browser or install a wallet.");
      return false;
    }

    return true;
  }

  async function ensureWallet(chainId: string) {
    if (!window.ethereum) {
      throw new Error("wallet not found.");
    }

    const accounts = (await window.ethereum.request({ method: "eth_requestAccounts" })) as string[];
    const from = accounts[0];

    if (!from) {
      throw new Error("wallet connection failed.");
    }

    setWalletAddress(from);

    const currentChainId = (await window.ethereum.request({ method: "eth_chainId" })) as string;

    if (chainId && currentChainId.toLowerCase() !== chainId.toLowerCase()) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
    }

    return from;
  }

  async function startWalletPreorder() {
    if (!validatePaymentStart()) {
      return;
    }

    if (!preorderWallet || !isValidHexAddress(preorderWallet)) {
      setStatus("error");
      setMessage("add a valid eth receiving wallet before taking wallet payments.");
      return;
    }

    if (!ethAmountWei) {
      setStatus("error");
      setMessage("add NEXT_PUBLIC_NAIRA_PER_ETH in vercel before taking eth payments.");
      return;
    }

    try {
      const from = await ensureWallet(preorderChainId);
      const ethereum = window.ethereum;

      if (!ethereum) {
        throw new Error("wallet not found.");
      }

      const value = toHexQuantity(ethAmountWei);
      const txHash = (await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from,
            to: preorderWallet,
            value,
          },
        ],
      })) as string;

      await reservePreorder({
        txHash,
        paymentWallet: preorderWallet,
        paymentAmountWei: ethAmountWei,
        paymentChainId: preorderChainId || "wallet default",
        paymentMethod: `native wallet payment on ${preorderChainName}`,
        paymentAsset: "eth",
      });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "wallet preorder failed.");
    }
  }

  async function startUsdtPreorder() {
    if (!validatePaymentStart()) {
      return;
    }

    if (!isValidHexAddress(usdtWallet) || !isValidHexAddress(usdtContract)) {
      setStatus("error");
      setMessage("add valid usdt wallet and token contract before taking usdt payments.");
      return;
    }

    if (!usdtAmountUnits) {
      setStatus("error");
      setMessage("add NEXT_PUBLIC_NAIRA_PER_USDT before taking usdt payments.");
      return;
    }

    try {
      const from = await ensureWallet(usdtChainId);
      const ethereum = window.ethereum;

      if (!ethereum) {
        throw new Error("wallet not found.");
      }

      const txHash = (await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from,
            to: usdtContract,
            value: "0x0",
            data: encodeErc20Transfer(usdtWallet, usdtAmountUnits),
          },
        ],
      })) as string;

      await reservePreorder({
        txHash,
        paymentWallet: usdtWallet,
        paymentAmountUnits: usdtAmountUnits,
        paymentChainId: usdtChainId,
        paymentMethod: "erc20 usdt transfer",
        paymentAsset: "usdt",
      });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "wallet preorder failed.");
    }
  }

  async function reserveBtcPreorder() {
    setStatus("loading");
    setMessage("");

    if (!items.length) {
      setStatus("error");
      setMessage("add a product before reserving btc preorder.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("enter a valid email before btc preorder.");
      return;
    }

    if (!btcTxHash.trim()) {
      setStatus("error");
      setMessage("paste the btc transaction id after sending payment.");
      return;
    }

    await reservePreorder({
      txHash: btcTxHash.trim(),
      paymentWallet: btcWallet,
      paymentChainId: "bitcoin",
      paymentMethod: "btc transfer",
      paymentAsset: "btc",
    });
  }

  async function reserveBankPreorder() {
    setStatus("loading");
    setMessage("");

    if (!items.length) {
      setStatus("error");
      setMessage("add a product before reserving bank transfer.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("enter a valid email before bank transfer.");
      return;
    }

    if (!bankName || !bankAccountName || !bankAccountNumber) {
      setStatus("error");
      setMessage("add bank details in vercel before taking bank transfers.");
      return;
    }

    if (!bankReference.trim()) {
      setStatus("error");
      setMessage("enter sender name or transfer reference after payment.");
      return;
    }

    await reservePreorder({
      txHash: bankReference.trim(),
          paymentWallet: `${bankName} / ${bankAccountNumber}`,
      paymentAmountUnits: preorderAmountNaira.toString(),
      paymentChainId: "bank",
      paymentMethod: "bank transfer",
      paymentAsset: "bank_transfer",
    });
  }

  return (
    <div className="cart-overlay" role="dialog" aria-modal="true" aria-label="shopping cart">
      <aside className="cart-drawer">
        <div className="cart-header">
          <div>
            <p className="section-kicker">preorder cart</p>
            <h2>your ypod setup</h2>
          </div>
          <button className="cart-close" type="button" onClick={closeCart} aria-label="close cart">
            x
          </button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <p className="empty-cart">your cart is empty.</p>
          ) : (
            items.map((item) => (
              <article className="cart-item" key={item.lineId}>
                <img src={item.image} alt={`${item.name} cart thumbnail`} />
                <div>
                  <h4>{item.name}</h4>
                  <p>{item.wrap === "none" ? item.color : `${item.color} / ${item.wrap}`}</p>
                  {item.wrapPreview ? <img className="cart-wrap-preview" src={item.wrapPreview} alt={`${item.wrap} selected print`} /> : null}
                  <p>{item.price}</p>
                  <div className="cart-line-actions">
                    <div className="quantity-control">
                      <button type="button" onClick={() => updateQuantity(item.lineId, item.quantity - 1)} aria-label={`decrease ${item.name} quantity`}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.lineId, item.quantity + 1)} aria-label={`increase ${item.name} quantity`}>
                        +
                      </button>
                    </div>
                    <button type="button" onClick={() => removeItem(item.lineId)}>
                      remove
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="subtotal-row">
            <span>{preorderPaymentMode === "deposit" ? "deposit due" : "subtotal"}</span>
            <span>{formatNaira(preorderAmountNaira)}</span>
          </div>
          {preorderPaymentMode === "deposit" ? (
            <div className="subtotal-row secondary-row">
              <span>cart total</span>
              <span>{formatNaira(subtotal)}</span>
            </div>
          ) : null}
          <div className="subtotal-row secondary-row">
            <span>eth estimate</span>
            <span>{ethAmountWei ? `${ethAmountWei} wei` : "rate needed"}</span>
          </div>
          <div className="subtotal-row secondary-row">
            <span>usdt estimate</span>
            <span>{usdtAmountUnits ? `${usdtAmountUnits} units` : "rate needed"}</span>
          </div>
          <div className="subtotal-row secondary-row">
            <span>cart total</span>
            <span>{formatNaira(subtotal)}</span>
          </div>
          <label className="checkout-field">
            email for preorder
            <input type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <div className="checkout-actions">
            <button className="shop-button" type="button" onClick={() => reservePreorder()} disabled={!items.length || status === "loading"}>
              {status === "loading" ? "saving..." : "reserve preorder"}
            </button>
            <button className="shop-button secondary" type="button" onClick={connectWallet}>
              {walletAddress ? "wallet connected" : "connect wallet"}
            </button>
            <button className="shop-button secondary" type="button" onClick={startWalletPreorder} disabled={!canPayEth || status === "loading"}>
              {ethAmountWei ? "pay eth" : "set eth rate"}
            </button>
            <button className="shop-button secondary" type="button" onClick={startUsdtPreorder} disabled={!canPayUsdt || status === "loading"}>
              {usdtAmountUnits ? "pay usdt" : "set usdt rate"}
            </button>
          </div>
          {message ? <p className={`waitlist-message cart-message ${status}`}>{message}</p> : null}
          <div className="btc-payment">
            <p>btc address</p>
            <a href={`bitcoin:${btcWallet}`}>{btcWallet}</a>
            <input
              type="text"
              placeholder="paste btc transaction id"
              value={btcTxHash}
              onChange={(event) => setBtcTxHash(event.target.value)}
            />
            <button className="shop-button secondary" type="button" onClick={reserveBtcPreorder} disabled={!items.length || status === "loading"}>
              save btc preorder
            </button>
          </div>
          <div className="btc-payment">
            <p>bank transfer</p>
            {bankName && bankAccountName && bankAccountNumber ? (
              <>
                <strong>{bankName}</strong>
                <span>{bankAccountName}</span>
                <span>{bankAccountNumber}</span>
              </>
            ) : (
              <span>bank details not configured yet</span>
            )}
            <input
              type="text"
              placeholder="sender name or transfer reference"
              value={bankReference}
              onChange={(event) => setBankReference(event.target.value)}
            />
            <button className="shop-button secondary" type="button" onClick={reserveBankPreorder} disabled={!canUseBank || status === "loading"}>
              {canUseBank ? "save bank preorder" : "set bank details"}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
