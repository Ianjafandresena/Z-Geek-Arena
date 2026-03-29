// ===========================
// FORMATTERS — Utilitaires de formatage
// ===========================

/**
 * Formate une date ISO en format lisible français
 * Ex: "2026-05-01" → "01 Mai 2026"
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

/**
 * Formate une plage de dates
 * Ex: ("2026-05-01", "2026-05-03") → "01 - 03 Mai"
 */
export function formatDateRange(debut: string, fin: string): string {
  const d1 = new Date(debut)
  const d2 = new Date(fin)
  const dayStart = d1.getDate().toString().padStart(2, '0')
  const dayEnd = d2.getDate().toString().padStart(2, '0')
  const month = d1.toLocaleDateString('fr-FR', { month: 'long' })
  const capitalMonth = month.charAt(0).toUpperCase() + month.slice(1)
  return `${dayStart} - ${dayEnd} ${capitalMonth}`
}

/**
 * Convertit un statut technique en label lisible
 */
export function formatStatut(statut: string): string {
  const map: Record<string, string> = {
    'a_venir': 'À VENIR',
    'inscriptions_ouvertes': 'INSCRIPTIONS OUVERTES',
    'en_cours': 'EN COURS',
    'termine': 'TERMINÉ',
    'annule': 'ANNULÉ',
  }
  return map[statut] || statut.toUpperCase()
}

/**
 * Formate une date relative (il y a X min/h/j)
 */
export function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const minutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return "À l'instant"
  if (minutes < 60) return `Il y a ${minutes} min`
  if (hours < 24) return `Il y a ${hours}h`
  return `Il y a ${days}j`
}
