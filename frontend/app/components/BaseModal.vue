<template>
  <Transition name="modal">
    <div v-if="isOpen" class="modal-overlay" @click.self="cancel">
      <div class="modal-content" :class="type">
        <div class="modal-header">
          <div class="modal-icon" v-if="type === 'confirm'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div class="modal-icon success" v-else-if="type === 'success'">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h3 class="modal-title">{{ title }}</h3>
        </div>
        
        <div class="modal-body">
          <p>{{ message }}</p>
        </div>
        
        <div class="modal-footer">
          <button v-if="type === 'confirm'" class="btn-cancel" @click="cancel">
            Annuler
          </button>
          <button class="btn-confirm" @click="confirm">
            {{ confirmText || (type === 'confirm' ? 'Confirmer' : 'OK') }}
          </button>
        </div>
        
        <button class="close-btn" @click="cancel">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const { isOpen, title, message, type, confirmText, resolve } = useUIMessage()

const confirm = () => {
  if (resolve.value) resolve.value(true)
  isOpen.value = false
}

const cancel = () => {
  if (resolve.value) resolve.value(false)
  isOpen.value = false
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1.5rem;
}

.modal-content {
  background: #111427;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  width: 100%;
  max-width: 440px;
  position: relative;
  padding: 2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 1rem;
}

.modal-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 165, 2, 0.1);
  color: #ffa502;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.modal-icon.success {
  background: rgba(46, 213, 115, 0.1);
  color: #2ed573;
}

.modal-icon svg { width: 24px; height: 24px; }

.modal-title {
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0;
  color: #fff;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.modal-body {
  text-align: center;
  margin-bottom: 1.5rem;
}

.modal-body p {
  color: #8892b0;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

.modal-footer {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.modal-footer button {
  padding: 0.65rem 1.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.03);
  color: #5a6380;
  border-color: rgba(255, 255, 255, 0.05) !important;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

.btn-confirm {
  background: #00e5ff;
  color: #000;
}

.btn-confirm:hover {
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.4);
  transform: translateY(-1px);
}

.modal-content.confirm .btn-confirm {
  background: #ff4757;
  color: #fff;
}

.modal-content.confirm .btn-confirm:hover {
  box-shadow: 0 0 20px rgba(255, 71, 87, 0.4);
}

.close-btn {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: transparent;
  border: none;
  color: #5a6380;
  cursor: pointer;
  padding: 0.25rem;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.close-btn:hover { opacity: 1; }
.close-btn svg { width: 20px; height: 20px; }

/* Transition */
.modal-enter-active, .modal-leave-active { transition: all 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-content { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-enter-from .modal-content { transform: scale(0.9) translateY(20px); }
</style>
