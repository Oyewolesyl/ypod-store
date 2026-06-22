"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("ypod remote");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function submitWaitlist(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, interest }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message ?? "Could not join waitlist.");
      }

      setStatus("success");
      setEmail("");
      setMessage("you are on the ypod waitlist.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not join waitlist.");
    }
  }

  return (
    <form className="waitlist-form" onSubmit={submitWaitlist}>
      <div>
        <label htmlFor="waitlist-email">email</label>
        <input
          id="waitlist-email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="waitlist-interest">interest</label>
        <select id="waitlist-interest" name="interest" value={interest} onChange={(event) => setInterest(event.target.value)}>
          <option>ypod remote</option>
          <option>yema lite</option>
          <option>yema-1</option>
          <option>yema pro</option>
          <option>bundle</option>
          <option>custom wraps</option>
        </select>
      </div>
      <button className="shop-button light" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "joining..." : "join waitlist"}
      </button>
      {message ? <p className={`waitlist-message ${status}`}>{message}</p> : null}
    </form>
  );
}
