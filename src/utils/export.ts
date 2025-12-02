import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { BuilderElement, ExportOptions } from '@/types/builder';

export async function exportToFile(code: string, filename: string) {
  const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, filename);
}

export async function exportProject(
  elements: BuilderElement[],
  componentCode: string,
  options: ExportOptions
) {
  const zip = new JSZip();

  // Create project structure
  const src = zip.folder('src');
  const components = src?.folder('components');

  // Add main component
  const extension = options.format === 'tsx' ? 'tsx' : 'jsx';
  components?.file(`${options.componentName}.${extension}`, componentCode);

  // Add package.json
  zip.file(
    'package.json',
    JSON.stringify(
      {
        name: 'exported-component',
        version: '1.0.0',
        private: true,
        dependencies: {
          react: '^18.2.0',
          'react-dom': '^18.2.0',
          next: '^14.0.0',
        },
        devDependencies: {
          tailwindcss: '^3.4.0',
          postcss: '^8.4.0',
          autoprefixer: '^10.4.0',
          typescript: '^5.0.0',
          '@types/react': '^18.2.0',
        },
      },
      null,
      2
    )
  );

  // Add tailwind.config.js
  zip.file(
    'tailwind.config.js',
    `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`
  );

  // Add postcss.config.js
  zip.file(
    'postcss.config.js',
    `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`
  );

  // Add global CSS
  src?.file(
    'globals.css',
    `@tailwind base;
@tailwind components;
@tailwind utilities;
`
  );

  // Add README
  zip.file(
    'README.md',
    `# Exported Component

This component was generated using Visual Tailwind Builder.

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Import the component:
\`\`\`jsx
import ${options.componentName} from './components/${options.componentName}';
\`\`\`

3. Use it in your project!
`
  );

  // Generate and download zip
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `${options.componentName}-project.zip`);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
