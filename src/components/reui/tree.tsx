import * as React from "react"
import { cn } from "@/lib/utils"
import type { TreeInstance, TreeItem as TreeItemType } from "@headless-tree/core"
import { ChevronRight } from "lucide-react"

interface TreeProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  tree: TreeInstance<T>
  indent?: number
}

function Tree<T>({
  tree,
  className,
  children,
  ...props
}: TreeProps<T>) {
  return (
    <div
      {...tree.getContainerProps("Permissions")}
      className={cn("flex flex-col", className)}
      {...props}
    >
      {children}
    </div>
  )
}

interface TreeItemProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  item: TreeItemType<T>
  indent?: number
}

function TreeItem<T>({
  item,
  indent = 24,
  className,
  children,
  ...props
}: TreeItemProps<T>) {
  const isFolder = item.isFolder()
  const depth = item.getItemMeta().level

  return (
    <div
      {...item.getProps()}
      className={cn(
        "flex flex-col outline-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface TreeItemLabelProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  item?: TreeItemType<T>
}

function TreeItemLabel<T>({
  item,
  className,
  children,
  ...props
}: TreeItemLabelProps<T>) {
  const isFolder = item?.isFolder() ?? false
  const isExpanded = item?.isExpanded() ?? false

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm hover:bg-muted cursor-pointer select-none",
        className
      )}
      {...props}
    >
      {isFolder && (
        <ChevronRight
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            isExpanded && "rotate-90"
          )}
        />
      )}
      {children}
    </div>
  )
}

export { Tree, TreeItem, TreeItemLabel }
export type { TreeProps, TreeItemProps, TreeItemLabelProps }
