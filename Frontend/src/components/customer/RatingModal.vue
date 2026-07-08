<script setup>
import { ref } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  rental: {
    type: Object,
    default: () => ({})
  },
  isSubmitting: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'submit']);

const rating = ref(0);
const hoverRating = ref(0);
const comment = ref('');

const setRating = (val) => {
  rating.value = val;
};

const handleClose = () => {
  if (props.isSubmitting) return;
  rating.value = 0;
  hoverRating.value = 0;
  comment.value = '';
  emit('close');
};

const handleSubmit = () => {
  if (rating.value === 0) {
    alert('Silakan berikan rating (bintang) terlebih dahulu.');
    return;
  }
  if (!comment.value.trim()) {
    alert('Ulasan teks (review) wajib diisi.');
    return;
  }
  emit('submit', {
    rating: rating.value,
    comment: comment.value
  });
};
</script>

<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center font-['Manrope'] px-4">
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        @click="handleClose"
      ></div>

      <!-- Modal Content -->
      <div 
        class="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden flex flex-col transform transition-all"
      >
        <!-- Close Button -->
        <button 
          @click="handleClose"
          :disabled="isSubmitting"
          class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors z-20 disabled:opacity-50"
        >
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div class="p-8">
          <!-- Header -->
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <span class="material-symbols-outlined text-3xl">star_rate</span>
            </div>
            <h2 class="text-2xl font-extrabold text-[#191c1e]">How was your experience?</h2>
            <p class="text-[#727687] text-sm mt-2">
              Your feedback for <strong class="text-[#0050cb]">{{ rental.car?.name }}</strong> helps us improve our service.
            </p>
          </div>

          <!-- Star Rating -->
          <div class="flex items-center justify-center gap-2 mb-6">
            <button 
              v-for="i in 5" 
              :key="i"
              @click="setRating(i)"
              @mouseenter="hoverRating = i"
              @mouseleave="hoverRating = 0"
              class="transition-transform hover:scale-110 focus:outline-none"
              :class="{'animate-pulse': isSubmitting}"
              :disabled="isSubmitting"
            >
              <span 
                class="material-symbols-outlined text-4xl transition-colors duration-200"
                :class="i <= (hoverRating || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'"
                :style="i <= (hoverRating || rating) ? 'font-variation-settings: \'FILL\' 1' : 'font-variation-settings: \'FILL\' 0'"
              >
                star
              </span>
            </button>
          </div>

          <!-- Comment Textarea -->
          <div class="mb-6">
            <label class="block text-xs font-bold text-[#727687] uppercase tracking-widest mb-2">Leave a Review <span class="text-red-500">*</span></label>
            <textarea 
              v-model="comment"
              rows="4"
              placeholder="Tell us what you loved or what could be better..."
              class="w-full bg-[#f7f9fb] border border-[#c2c6d8]/50 rounded-xl p-4 text-sm focus:outline-none focus:border-[#0050cb] focus:ring-1 focus:ring-[#0050cb] transition-all resize-none text-[#191c1e]"
              :disabled="isSubmitting"
              required
            ></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col gap-3">
            <button 
              @click="handleSubmit"
              :disabled="isSubmitting || rating === 0 || !comment.trim()"
              class="w-full bg-gradient-to-r from-[#0050cb] to-blue-600 hover:from-blue-600 hover:to-[#0050cb] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isSubmitting" class="material-symbols-outlined animate-spin text-[20px]">sync</span>
              <span v-else class="material-symbols-outlined text-[20px]">send</span>
              {{ isSubmitting ? 'Submitting...' : 'Submit Review' }}
            </button>
            <button 
              @click="handleClose"
              :disabled="isSubmitting"
              class="w-full bg-white border border-[#c2c6d8] hover:bg-slate-50 text-[#727687] font-bold py-3.5 rounded-xl transition-all active:scale-[0.99] disabled:opacity-50"
            >
              Maybe Later
            </button>
          </div>

        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .transform,
.modal-leave-active .transform {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from .transform {
  transform: scale(0.95) translateY(10px);
}

.modal-leave-to .transform {
  transform: scale(0.95) translateY(10px);
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
