import { Phone } from "lucide-react";

const CONTACTS = [
  {
    name: "KIRAN mental health helpline",
    detail: "24×7, all India. Ask for local dementia / neurology guidance.",
    phone: "1800-599-0019",
  },
  {
    name: "Emergency",
    detail: "Use if the person is lost, injured, or suddenly very confused.",
    phone: "112",
  },
  {
    name: "Gauhati Medical College Hospital",
    detail: "Neurology, Guwahati, Assam",
    phone: "0361-2529457",
  },
  {
    name: "NEIGRIHMS",
    detail: "Neurology, Shillong, Meghalaya",
    phone: "0364-2538025",
  },
  {
    name: "RIMS Imphal",
    detail: "Regional Institute of Medical Sciences, Manipur",
    phone: "0385-2414629",
  },
];

export function DoctorsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl text-foreground">Contact a doctor</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Screening is not a diagnosis. Take the result to a clinician. Call a local hospital if you already have one.
      </p>
      <ul className="mt-8 space-y-3">
        {CONTACTS.map((item) => (
          <li key={item.name} className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div>
              <p className="font-semibold text-foreground">{item.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
            </div>
            <a
              href={`tel:${item.phone.replace(/\s/g, "")}`}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
            >
              <Phone className="h-4 w-4" />
              {item.phone}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
