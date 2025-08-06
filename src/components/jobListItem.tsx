import { jobsTable } from "@/db/schema";
import companyLogoPlaceholder from "@/assets/company-logo-placeholder.png";
import Image from "next/image";
import {
  BanknoteIcon,
  BriefcaseIcon,
  ClockIcon,
  Globe2Icon,
  MapPin,
} from "lucide-react";
import { formatMoney, relativeDate } from "@/lib/utils";
import Badge from "@/components/Badge";

interface jobListItemProps {
  job: typeof jobsTable.$inferSelect;
}
export default function JobListItem({
  job: {
    title,
    companyName,
    type,
    locationType,
    location,
    salary,
    companyLogoUrl,
    createdAt,
  },
}: jobListItemProps) {
  return (
    <article className="hover:bg-muted flex gap-3 rounded-lg border p-5">
      <Image
        src={companyLogoUrl || companyLogoPlaceholder}
        alt={`${companyName} logo`}
        width={100}
        height={100}
        className="self-center rounded-lg"
      />
      <div className="flex-grow space-y-3">
        <div>
          <h2 className="text-xl font-medium">{title}</h2>
          <p className="text-muted-foreground">{companyName}</p>
        </div>
        <div className="text-muted-foreground">
          <p className="flex items-center gap-1.5 sm:hidden">
            <BriefcaseIcon size={16} className="shrink-0" />
            {type}
          </p>
          <p className="flex items-center gap-1.5">
            <MapPin size={16} className="shrink-0" />
            {locationType}
          </p>
          <p className="flex items-center gap-1.5">
            <Globe2Icon size={16} className="shrink-0" />
            {location || "Worldwide"}
          </p>
          <p className="flex items-center gap-1.5">
            <BanknoteIcon size={16} className="shrink-0" />
            {formatMoney(salary)}
          </p>
          <p className="flex items-center gap-1.5 sm:hidden">
            <ClockIcon size={16} className="shrink-0" />
            {relativeDate(createdAt)}
          </p>
        </div>
      </div>
      <div className="hidden shrink-0 flex-col items-end justify-between sm:flex">
        <Badge>{type}</Badge>
        <span className="text-muted-foreground flex items-center gap-1.5">
          <ClockIcon size={16} />
          {relativeDate(createdAt)}
        </span>
      </div>
    </article>
  );
}
