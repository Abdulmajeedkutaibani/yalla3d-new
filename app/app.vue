<!--app/app.vue-->
<script setup lang="ts">
const { site } = useAppConfig();
const { name, description } = site;
const { locale, locales } = useI18n();

const currentIso = computed(() => {
  const match = (locales.value as any[] | undefined)?.find(
    (l) => l.code === locale.value
  );
  return match?.iso || locale.value || 'en-GB';
});

const isRtl = computed(() => (locale.value || '').startsWith('ar'));

const ogLocale = computed(() => (currentIso.value as string).replace('-', '_'));

useHead({
  htmlAttrs: {
    lang: currentIso.value as string,
    dir: isRtl.value ? 'rtl' : 'ltr',
  },
  titleTemplate: (chunk?: string) => (chunk ? `${chunk} - ${name}` : name),
});

useSeoMeta({
  description,
  ogType: 'website',
  ogSiteName: name,
  ogLocale: ogLocale.value as string,
  ogImage: 'https://commerce.nuxt.dev/social-card.jpg',
  twitterCard: 'summary_large_image',
  twitterSite: '@zhatlen',
  twitterCreator: '@zhatlen',
  twitterImage: 'https://commerce.nuxt.dev/social-card.jpg',
  keywords: `${name}, ecommerce, nuxt, supabase`,
  viewport:
    'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover',
});
</script>

<template>
  <AppHeader />
  <main class="pt-[72px] lg:pt-20 min-h-[calc(100vh-72px)]">
    <NuxtPage />
  </main>
  <AppFooter />
  <Notivue v-slot="item">
    <Notification :item="item" :theme="materialTheme" />
  </Notivue>
</template>

<style lang="postcss">
.dark {
  @apply bg-black text-neutral-100;
  color-scheme: dark;
}
.dropdown-enter-active {
  @apply transition duration-200 ease-out;
}
.dropdown-enter-from,
.dropdown-leave-to {
  @apply translate-y-5 opacity-0;
}
.dropdown-enter-to,
.dropdown-leave-from {
  @apply transform opacity-100;
}
.dropdown-leave-active {
  @apply transition duration-150 ease-in;
}
</style>
