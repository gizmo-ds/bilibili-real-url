import { defineComponent, computed } from 'vue';
import { usePreferredDark, useStorage } from '@vueuse/core';
import {
  darkTheme,
  lightTheme,
  NConfigProvider,
  NNotificationProvider,
  NMessageProvider,
  NLayout
} from 'naive-ui';
import GitHubCorners from './components/GitHubCorners';
import Bilibili from './views/Bilibili.vue';
import pkg from '../package.json';

export default defineComponent({
  setup() {
    const isDark = usePreferredDark();
    const isDarkMode = useStorage('app-darkmode', isDark.value);
    const theme = computed(() => (isDarkMode.value ? darkTheme : lightTheme));
    return () => (
      <NConfigProvider theme={theme.value} inlineThemeDisabled>
        <NMessageProvider placement="bottom-right">
          <NNotificationProvider placement="bottom-right">
            <GitHubCorners href={pkg.homepage} target="_blank" />
            <NLayout embedded class="h-screen">
              <h1 class="text-center align-middle">
                <img
                  src="/favicon.png"
                  alt="logo"
                  class="h-30px mr-8px rounded-4px align-middle"
                />
                <span>屑站解析</span>
              </h1>

              <div class="max-w-800px my-0 mx-auto">
                <Bilibili />
              </div>
            </NLayout>
          </NNotificationProvider>
        </NMessageProvider>
      </NConfigProvider>
    );
  }
});
