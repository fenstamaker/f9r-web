"use client";
import { Letter } from "react-letter";

export default function Newsletter({ html }: { html: string }) {
  return <Letter html={html} />;
}
