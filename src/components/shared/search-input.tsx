"use client";

import { useState, useEffect } from "react";
import { SearchIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";

export function SearchInput({
  defaultValue,
  placeholder = "Search...",
  onSearch,
}: {
  defaultValue?: string;
  placeholder?: string;
  onSearch: (value: string | undefined) => void;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const debounced = useDebounce(value, 450);

  useEffect(() => {
    onSearch(debounced || undefined);
  }, [debounced]);

  return (
    <div className="relative w-full max-w-sm">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pr-8 pl-8"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1/2 right-1 size-6 -translate-y-1/2"
          onClick={() => setValue("")}
        >
          <XIcon className="size-3.5" />
        </Button>
      )}
    </div>
  );
}
