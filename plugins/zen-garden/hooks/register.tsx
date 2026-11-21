import type { Register, ThemeSetArgs } from 'claude-code'

import { makeColors } from './make-colors.js'
import { SCENE } from './scene.js'

// Day: sunlit shoji paper, beige with moss green. Night: a lantern-lit garden behind paper walls.
const { theme, problems } = makeColors({
  label: 'Zen Garden',
  roles: { accent: '#4f7a4a', danger: '#a8483a', success: '#5d8a47', warning: '#a47a2c', pro: '#6b7f6a' },
  light: {
    gray: {
      anchors: {
        'surface-0': '#ebe3cf',
        'surface-1': '#f2ecdc',
        'surface-2': '#f8f4e8',
        'text-primary': '#27301f',
        'text-secondary': '#46513a',
        'text-muted': '#5e664f',
      },
    },
    git: { added: '#4f8a4a', modified: '#a47a2c', removed: '#a8483a' },
  },
  dark: {
    roles: { accent: '#9cc48a', danger: '#d98a78', success: '#a3cc8a', warning: '#d9b46a', pro: '#a9bfa6' },
    gray: {
      anchors: {
        'surface-0': '#0f150f',
        'surface-1': '#172016',
        'surface-2': '#1e2a1d',
        'surface-3': '#243222',
        'text-primary': '#f1ecd9',
        'text-secondary': '#d3d1b9',
        'text-muted': '#aeb199',
      },
    },
  },
})

const LOOK: ThemeSetArgs = {
  colors: theme,
  backdrop: { scene: 'zen-garden', glass: false },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }
    const set = await $.theme.set(LOOK)

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }

    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return <Svg source={SCENE} alt="Bamboo swaying in the wind beside a koi pond, behind lantern-lit paper walls" isInteractive />
  })
}
