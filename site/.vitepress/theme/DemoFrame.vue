<script setup>
import { computed } from 'vue';
import { withBase } from 'vitepress';

// <DemoFrame height="760" /> shows the live demo, which runs the real hub on sample data in an iframe.
// Options go on the address: ?finance=0 switches a part off, ?kids=Mia shows the kids screen.
const props = defineProps({ query: { type: String, default: '' }, height: { type: [String, Number], default: 760 }, title: { type: String, default: 'KSH Family Hub demo' }, narrow: { type: Boolean, default: false } });
const src = computed(() => `${withBase('/sandbox/app.html')}${props.query ? `?${props.query}` : ''}`);
</script>

<template>
  <div class="fh-demo" :class="{ narrow }">
    <iframe :src="src" :title="title" :style="{ height: height + 'px' }" loading="lazy" />
    <a class="fh-demo-open" :href="src" target="_blank" rel="noopener">Open full screen</a>
  </div>
</template>

<style scoped>
.fh-demo { margin: 20px 0 28px; border: 1px solid var(--vp-c-divider); border-radius: 22px; overflow: hidden; background: #0f1218; position: relative; }
.fh-demo.narrow { max-width: 430px; margin-left: auto; margin-right: auto; }
iframe { display: block; width: 100%; border: 0; }
.fh-demo-open { position: absolute; right: 12px; bottom: 12px; font-size: 12.5px; background: rgba(15,18,24,.85); color: #fff !important; border: 1px solid rgba(255,255,255,.2); border-radius: 999px; padding: 4px 12px; text-decoration: none; }
</style>
