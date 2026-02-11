import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex h-10 w-full border border-gray-200 bg-white px-4 py-2 text-base shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5] focus-visible:border-[#4F46E5] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm hover:border-gray-300",
        className
      )}
      style={{ borderRadius: '10px' }}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }