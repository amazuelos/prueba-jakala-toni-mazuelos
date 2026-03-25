/**
 * Breadcrumbs — Shared component
 *
 * Componente reutilizable de breadcrumbs.
 * Los items con onClick son clicables, el último es texto plano.
 */

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  testId?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav data-testid="breadcrumbs" className="flex items-center gap-2 text-sm text-gray-500">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          {index > 0 && <span aria-hidden="true">&gt;</span>}
          {item.onClick ? (
            <button
              data-testid={item.testId}
              onClick={item.onClick}
              className="hover:text-green-600 hover:underline"
            >
              {item.label}
            </button>
          ) : (
            <span data-testid={item.testId} className="text-gray-800 font-medium">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
