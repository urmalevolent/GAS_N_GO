<script setup>
import AuthModal from '@/components/customer/AuthModal.vue'
import GuideModal from '@/components/customer/GuideModal.vue'
</script>

<template>
  <div>
    <router-view />
    <AuthModal />
    <GuideModal />
  </div>
</template>
