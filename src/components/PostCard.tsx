import dayjs from "dayjs";
import slugify from "@utils/slugify";
// text-c-lighter

export interface Props {
  href: string;
  title: string;
  pubDatetime: Date;
}

export default function PostCard({ href, title, pubDatetime }: Props) {
  return (
    <div class="hstack font-normal" m="y-4 x-0.8">
      <div class="w-18" text="sm">
        {dayjs(pubDatetime).format("MM-DD")}
      </div>

      <a class="flex-1" href={href}>
        {title}
      </a>
    </div>
  );
}
