import { ChevronDown, ChevronUp, GripVertical, Lock } from "lucide-react";
import { useRef } from "react";
import IconButton from "./IconButton";

export interface OrderListItem {
  id: string;
  label: string;
  meta?: string;
  badge?: string;
}

interface DraggableOrderListProps {
  items: OrderListItem[];
  onChange: (items: OrderListItem[]) => void;
  frozen?: boolean;
  emptyMessage?: string;
  selectable?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

export default function DraggableOrderList({
  items,
  onChange,
  frozen = false,
  emptyMessage = "Nothing to reorder yet.",
  selectable = false,
  selectedId = null,
  onSelect,
}: DraggableOrderListProps) {
  const dragIndex = useRef<number | null>(null);

  const moveItem = (from: number, to: number) => {
    if (frozen || from === to) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  if (!items.length) {
    return <p className="file-hint muted">{emptyMessage}</p>;
  }

  return (
    <ul className={`order-list ${frozen ? "frozen" : ""}`}>
      {items.map((item, index) => {
        const isSelected = selectable && selectedId === item.id;

        return (
          <li
            key={item.id}
            className={`order-list-item ${isSelected ? "selected" : ""} ${selectable ? "selectable" : ""}`}
            draggable={!frozen}
            onClick={() => {
              if (selectable && onSelect) onSelect(item.id);
            }}
            onDragStart={() => {
              if (!frozen) dragIndex.current = index;
            }}
            onDragOver={(event) => {
              if (!frozen) event.preventDefault();
            }}
            onDrop={() => {
              if (!frozen && dragIndex.current !== null) {
                moveItem(dragIndex.current, index);
                dragIndex.current = null;
              }
            }}
            onDragEnd={() => {
              dragIndex.current = null;
            }}
          >
            <span className="order-list-grip" aria-hidden="true">
              {frozen ? <Lock size={16} /> : <GripVertical size={18} />}
            </span>
            <span className="order-list-content">
              <span className="order-list-label-row">
                <span className="order-list-label">{item.label}</span>
                {item.badge && <span className="order-list-badge">{item.badge}</span>}
              </span>
              {item.meta && <span className="order-list-meta">{item.meta}</span>}
            </span>
            <span className="order-list-position">{index + 1}</span>
            {!frozen && items.length > 1 && (
              <span className="order-list-move">
                <IconButton
                  icon={<ChevronUp size={16} />}
                  label="Move up"
                  variant="ghost"
                  iconOnly
                  disabled={index === 0}
                  onClick={(event) => {
                    event.stopPropagation();
                    moveItem(index, index - 1);
                  }}
                />
                <IconButton
                  icon={<ChevronDown size={16} />}
                  label="Move down"
                  variant="ghost"
                  iconOnly
                  disabled={index === items.length - 1}
                  onClick={(event) => {
                    event.stopPropagation();
                    moveItem(index, index + 1);
                  }}
                />
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
