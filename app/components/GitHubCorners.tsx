import { defineComponent } from 'vue';
import GitHub from '../assets/github-corner-right.svg?component';
import { useStorage } from '@vueuse/core';

export default defineComponent<{
  href: string;
  target?: string;
}>(
  props => {
    const isDarkMode = useStorage('app-darkmode', false);
    return () => (
      <a
        href={props.href}
        target={props.target ?? '_blank'}
        class="github-corner"
        aria-label="View source on GitHub"
        title="View source on GitHub"
      >
        <GitHub class={isDarkMode.value ? 'dark' : 'light'} />
      </a>
    );
  },
  {
    props: ['href', 'target']
  }
);
