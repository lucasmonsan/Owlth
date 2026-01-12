import { isNull } from 'drizzle-orm';

/**
 * Filtra itens deletados (soft delete)
 * Remove itens onde deletedAt não é null
 */
export function excludeDeleted<T extends { deletedAt: Date | null }>(items: T[]): T[] {
  return items.filter((item) => item.deletedAt === null);
}

/**
 * Condição para queries que devem excluir deletados
 * Uso: .where(softDeleteCondition(table.deletedAt))
 */
export function softDeleteCondition() {
  return isNull;
}
