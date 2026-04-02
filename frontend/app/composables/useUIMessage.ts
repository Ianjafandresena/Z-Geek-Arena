const isOpen = ref(false)
const title = ref('')
const message = ref('')
const type = ref('info') // info | confirm | success
const confirmText = ref('')
const resolve = ref<((value: boolean) => void) | null>(null)

export function useUIMessage() {
  function open(options: { 
    title?: string, 
    message?: string, 
    type?: 'info' | 'confirm' | 'success', 
    confirmText?: string 
  }) {
    isOpen.value = true
    title.value = options.title || 'Information'
    message.value = options.message || ''
    type.value = options.type || 'info'
    confirmText.value = options.confirmText || ''
    
    return new Promise<boolean>((res) => {
      resolve.value = res
    })
  }

  function confirmDelete(resource: string) {
    return open({
      title: 'Confirmation de suppression',
      message: `Voulez-vous vraiment supprimer cet ${resource} ? Cette action est irréversible.`,
      type: 'confirm',
      confirmText: 'Supprimer définitivement'
    })
  }

  function showSuccess(msg: string) {
    return open({
      title: 'Opération réussie',
      message: msg,
      type: 'success',
      confirmText: 'Parfait'
    })
  }

  return {
    isOpen,
    title,
    message,
    type,
    confirmText,
    resolve,
    open,
    confirmDelete,
    showSuccess
  }
}
