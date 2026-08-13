import eslintConfigPrettier from 'eslint-config-prettier';
import boundaries from 'eslint-plugin-boundaries';
import importX from 'eslint-plugin-import-x';
import prettierPlugin from 'eslint-plugin-prettier';
import tsEslint from 'typescript-eslint';

export default [
  // 0. Global ignores for build artifacts and config files
  {
    ignores: [
      'dist/**',
      'coverage/**',
      '.husky/**',
      '.angular/**',
      '**/*.config.js',
      '**/*.config.mjs',
      '**/*.conf.js',
      'node_modules/**'
    ]
  },

  // 1. Base TypeScript recommended rules
  ...tsEslint.configs.recommended,

  // 2. Strict TypeScript rules (Zero any policy)
  {
    files: ['src/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ]
    }
  },

  // 3. Formatting and Import hygiene (Prettier + Universal Import ordering & deduplication)
  {
    files: ['src/**/*.ts'],
    plugins: {
      prettier: prettierPlugin,
      'import-x': importX
    },
    rules: {
      'prettier/prettier': 'warn',
      'no-duplicate-imports': 'error',
      'import-x/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index']
          ],
          pathGroups: [
            { pattern: '@angular/**', group: 'external', position: 'before' },
            { pattern: '@fitlab/**', group: 'internal', position: 'before' }
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always'
        }
      ]
    }
  },

  // 4. Remote MFE Architecture Boundaries configuration
  {
    files: ['src/**/*.ts'],
    plugins: {
      boundaries: boundaries
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.ts', '.js']
        }
      },
      'import-x/resolver': {
        node: {
          extensions: ['.ts', '.js']
        }
      },
      'boundaries/include': ['src/app/**/*.ts'],
      'boundaries/elements': [
        { type: 'core', pattern: 'src/app/core' },
        { type: 'shared', pattern: 'src/app/shared' },
        { type: 'feature', pattern: 'src/app/features' }
      ],
      'boundaries/ignore': [
        'src/main.ts',
        'src/bootstrap.ts',
        'src/app/app.config.ts',
        'src/app/app.routes.ts',
        'src/app/app.component.ts',
        'src/app/app.component.spec.ts'
      ]
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            // Core consome Shared
            {
              from: { element: { type: 'core' } },
              allow: [{ to: { element: { type: 'shared' } } }]
            },
            // Shared é folha
            {
              from: { element: { type: 'shared' } },
              allow: []
            },
            // Features consomem Core e Shared
            {
              from: { element: { type: 'feature' } },
              allow: [
                { to: { element: { type: 'core' } } },
                { to: { element: { type: 'shared' } } }
              ]
            }
          ]
        }
      ]
    }
  },

  // 5. Prettier config override to disable conflicting ESLint formatting rules
  eslintConfigPrettier
];
