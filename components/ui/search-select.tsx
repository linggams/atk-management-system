"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SearchSelectItem {
  id: string
  label: string
  value: string
  searchableText?: string
  disabled?: boolean
}

export interface SearchSelectProps {
  items: SearchSelectItem[]
  placeholder?: string
  onSelect?: (item: SearchSelectItem) => void
  value?: string
  className?: string
  disabled?: boolean
  size?: "sm" | "default"
}

export function SearchSelect({
  items,
  placeholder = "Search and select...",
  onSelect,
  value = "",
  className,
  disabled = false,
  size = "default",
}: SearchSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const selectedItem = items.find((item) => item.value === value)

  const filteredItems = React.useMemo(() => {
    if (!search) return items
    return items.filter((item) => {
      if (item.disabled) return false
      const searchText = (item.searchableText || `${item.label} ${item.value}`).toLowerCase()
      return searchText.includes(search.toLowerCase())
    })
  }, [items, search])

  const handleSelect = (item: SearchSelectItem) => {
    if (item.disabled) return
    onSelect?.(item)
    setOpen(false)
    setSearch("")
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
            "border-input text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50",
            size === "sm" ? "h-8" : "h-9",
            disabled && "bg-muted",
            className
          )}
        >
          <span className={cn("truncate", !selectedItem && "text-muted-foreground")}>
            {selectedItem?.label || placeholder}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          className={cn(
            "z-50 w-[--radix-popover-trigger-width] rounded-md border bg-popover p-0 text-popover-foreground shadow-md outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          )}
          align="start"
          sideOffset={4}
          style={{ width: "var(--radix-popover-trigger-width)" }}
          onOpenAutoFocus={(e) => {
            e.preventDefault()
            inputRef.current?.focus()
          }}
        >
          <div className="flex items-center border-b px-3">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            {filteredItems.length > 0 ? (
              <div className="p-1">
                {filteredItems.map((item) => {
                  const isSelected = value === item.value
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className={cn(
                        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        isSelected && "bg-accent text-accent-foreground",
                        item.disabled && "pointer-events-none opacity-50"
                      )}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="flex-1 truncate">{item.label}</span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No items found
              </div>
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
