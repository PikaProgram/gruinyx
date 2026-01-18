import ripple from '@ripple-ts/eslint-plugin';
import base from '@repo/eslint-config/base.js';

export default [...base, ...ripple.configs.recommended];
