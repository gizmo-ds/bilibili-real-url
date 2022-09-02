<script lang="ts" setup>
import pkg from "../../package.json"
import github from "../assets/github-corner-right.svg"
</script>

<template>
  <a :href="pkg.homepage" target="_blank" class="github-corner" aria-label="View source on GitHub"
    title="View source on GitHub">
    <github />
  </a>
</template>

<style lang="scss">
.github-corner {
  svg {
    fill: #fff;
    z-index: 1;

    .bg {
      fill: #101014;
    }
  }

  &:hover .octo-arm {
    animation: octocat-wave 560ms ease-in-out;
  }
}

.dark {
  .github-corner {
    svg {
      fill: #101014;

      .bg {
        fill: #fff;
      }
    }
  }
}


@keyframes octocat-wave {

  0%,
  100% {
    transform: rotate(0);
  }

  20%,
  60% {
    transform: rotate(-25deg);
  }

  40%,
  80% {
    transform: rotate(10deg);
  }
}

@media (max-width: 500px) {
  .github-corner:hover .octo-arm {
    animation: none;
  }

  .github-corner .octo-arm {
    animation: octocat-wave 560ms ease-in-out;
  }
}
</style>