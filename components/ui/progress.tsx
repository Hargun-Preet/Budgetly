"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

function Progress({
  className,
  value = 0,  // Default value to avoid NaN issues
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  indicator?: string;
  value?: number;
}) {
  const [progressValue, setProgressValue] = React.useState(0);

  React.useEffect(() => {
    // Simulate delayed animation for smoother effect
    const timeout = setTimeout(() => {
      setProgressValue(value);
    }, 50); 

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-3 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn(
          "bg-primary h-full transition-all rounded-full duration-1000 ease-in-out",
          props.indicator
        )}
        style={{ width: `${progressValue}%` }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };
