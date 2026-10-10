import { CheckCircle2Icon, CircleIcon } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { SHIPMENT_STATUS_LABEL } from "@/lib/constants";

interface TimelineEvent {
  status: string;
  note?: string | null;
  location?: string | null;
  createdAt: string;
}

export function TrackingTimeline({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return <p className="text-sm text-muted-foreground">No tracking events yet.</p>;
  }

  return (
    <ol className="relative space-y-6 border-l pl-6">
      {events.map((event, idx) => {
        const isLast = idx === events.length - 1;
        return (
          <li key={`${event.status}-${event.createdAt}`} className="relative">
            <span
              className={cn(
                "absolute top-0.5 -left-[29px] flex size-4 items-center justify-center rounded-full",
                isLast ? "bg-brand text-brand-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              {isLast ? <CheckCircle2Icon className="size-4" /> : <CircleIcon className="size-2.5 fill-current" />}
            </span>
            <p className="text-sm font-medium">{SHIPMENT_STATUS_LABEL[event.status] ?? event.status}</p>
            {event.note && <p className="text-sm text-muted-foreground">{event.note}</p>}
            {event.location && <p className="text-xs text-muted-foreground">📍 {event.location}</p>}
            <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(event.createdAt)}</p>
          </li>
        );
      })}
    </ol>
  );
}
