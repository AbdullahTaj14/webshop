import { Container } from "@/components/layout/container";
import { Truck, RotateCcw, ShieldCheck, Leaf } from "lucide-react";

const reasons = [
  {
    icon: Truck,
    title: "Free shipping over $150",
    description: "Two to five day delivery across the continental US.",
  },
  {
    icon: RotateCcw,
    title: "30-day returns",
    description: "Free returns and exchanges, no questions asked.",
  },
  {
    icon: ShieldCheck,
    title: "Secure checkout",
    description: "Encrypted payments through trusted, audited providers.",
  },
  {
    icon: Leaf,
    title: "Responsibly made",
    description: "Traceable materials and accountable manufacturing partners.",
  },
];

export function WhyShop() {
  return (
    <section id="why-shop" className="border-y border-border py-20 lg:py-24">
      <Container size="shell">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {reasons.map((reason) => (
            <div key={reason.title} className="flex flex-col gap-4">
              <reason.icon className="size-6 text-foreground" strokeWidth={1.25} />
              <div>
                <h3 className="text-[15px] font-medium text-foreground">{reason.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-secondary">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
