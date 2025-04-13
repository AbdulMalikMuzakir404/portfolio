import { TechIcon } from "@/components/TechIcon";
import { Fragment } from "react";
import { twMerge } from "tailwind-merge";

interface ToolboxItems {
  title: string;
  iconType: React.ElementType;
}

export const ToolboxItems = ({
  items,
  className,
  itemsWrapperClassname,
}: {
  items: ToolboxItems[];
  className?: string;
  itemsWrapperClassname?: string;
}) => {
  return (
    <div
      className={twMerge("flex", className)}
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}
    >
      <div
        className={twMerge(
          "flex flex-none py-0.5 gap-6 pr-6",
          itemsWrapperClassname
        )}
      >
        {[...new Array(2)].fill(0).map((_, index) => (
          <Fragment key={index}>
            {items.map((item) => (
              <div
                key={item.title}
                className="inline-flex items-center gap-4 py-2 px-3 outline outline-2 outline-white/10 rounded-lg"
              >
                <TechIcon component={item.iconType} />
                <span className="font-semibold">{item.title}</span>
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
