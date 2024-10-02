import Image from "next/image";
import JSONFormatter from "./json-formatter";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <JSONFormatter />
    </main>
  );
}
