import { useMemo } from 'react';
import type { BuilderElement, GeneratedCode } from '@/types/builder';
import { generateCode } from '@/lib/codeGenerator';

/**
 * Hook for generating JSX and TSX code from builder elements.
 * Memoized to prevent unnecessary recalculations.
 *
 * @param elements - Array of builder elements from the canvas
 * @param componentName - Optional name for the generated component
 * @returns Object containing generated JSX and TSX code strings
 */
export function useCodeGenerator(
  elements: BuilderElement[],
  componentName: string = 'GeneratedComponent'
): GeneratedCode {
  // Create a stable serialized version for dependency comparison
  const serializedElements = useMemo(
    () => JSON.stringify(elements),
    [elements]
  );

  // Generate code only when elements actually change
  const generatedCode = useMemo(() => {
    // Handle empty state
    if (!elements || elements.length === 0) {
      return {
        jsx: generateEmptyComponentJSX(componentName),
        tsx: generateEmptyComponentTSX(componentName),
      };
    }

    return generateCode(elements, componentName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializedElements, componentName]);

  return generatedCode;
}

/**
 * Generates JSX for an empty component
 */
function generateEmptyComponentJSX(componentName: string): string {
  return `import React from 'react';

export default function ${componentName}() {
  return (
    <div className="w-full">
      {/* Add elements to your canvas */}
    </div>
  );
}
`;
}

/**
 * Generates TSX for an empty component
 */
function generateEmptyComponentTSX(componentName: string): string {
  return `import React from 'react';

interface ${componentName}Props {
  className?: string;
}

export default function ${componentName}({ className }: ${componentName}Props) {
  return (
    <div className={\`w-full \${className || ''}\`}>
      {/* Add elements to your canvas */}
    </div>
  );
}
`;
}

/**
 * Hook for generating code with additional options
 */
export function useCodeGeneratorWithOptions(
  elements: BuilderElement[],
  options: {
    componentName?: string;
    includeImports?: boolean;
    wrapInFragment?: boolean;
  } = {}
): GeneratedCode & { preview: string } {
  const {
    componentName = 'GeneratedComponent',
    includeImports = true,
  } = options;

  const { jsx, tsx } = useCodeGenerator(elements, componentName);

  const preview = useMemo(() => {
    if (!elements || elements.length === 0) {
      return '<div className="w-full">\n  {/* Empty */}\n</div>';
    }

    // Generate a simpler preview version
    const { jsx: previewCode } = generateCode(elements, componentName);

    if (includeImports) {
      return previewCode;
    }

    // Remove import statement if not needed
    const lines = previewCode.split('\n');
    const importEndIndex = lines.findIndex((line) => line.trim() === '');
    return lines.slice(importEndIndex + 1).join('\n');
  }, [elements, componentName, includeImports]);

  return { jsx, tsx, preview };
}
