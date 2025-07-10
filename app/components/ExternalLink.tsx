import { NText } from 'naive-ui';
import { defineComponent } from 'vue';

export default defineComponent<{
  href: string;
  title?: string;
}>(
  props => {
    return () => (
      <NText
        tag="a"
        type="primary"
        //@ts-ignore
        href={props.href}
        title={props.title}
        target="_blank"
        rel="noopener noreferrer"
        class="ml-1 align-middle"
      >
        <span class="i-tabler-external-link inline-block"></span>
      </NText>
    );
  },
  {
    props: ['href', 'title']
  }
);
