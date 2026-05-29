import { Link, useRouterState } from '@tanstack/react-router';

interface ErrorMessage {
  title: string;
  description: string;
  buttonText: string;
}

const errorMessages: ErrorMessage[] = [
  {
    title: "Type 'never' is not assignable",
    description:
      "This route resolves to type 'unknown'. Expected type 'Page', but the compiler couldn't infer it. Try checking your type definitions.",
    buttonText: 'return home as Page',
  },
  {
    title: "Property 'page' does not exist",
    description:
      "Property 'page' does not exist on type 'Website'. Did you mean 'home'? The TypeScript compiler suggests checking for typos or missing imports.",
    buttonText: "() => navigate('home')",
  },
  {
    title: "Cannot find module './page'",
    description:
      'The requested module ./page was not found. Verify that the path is correct and that the file exists in your working directory.',
    buttonText: "import Home from './'",
  },
  {
    title: 'Type instantiation is excessively deep',
    description:
      'Type instantiation is excessively deep and possibly infinite. The compiler gave up trying to resolve this route. Even TypeScript has its limits.',
    buttonText: 'break;',
  },
  {
    title: 'Expression produces a union type',
    description:
      "Type 'Home | About | Blog | 404' has no call signatures. You've navigated to the '404' variant. Consider narrowing the type with a type guard.",
    buttonText: "if (route !== '404') return home",
  },
  {
    title: 'Type assertion failed',
    description:
      'Conversion of type string to type Page may be a mistake. Neither type sufficiently overlaps with the other. Perhaps you meant to navigate elsewhere?',
    buttonText: 'home as unknown as Page',
  },
  {
    title: 'Index signature is missing',
    description:
      "Element implicitly has an 'any' type because expression of type '404' can't be used to index type 'Routes'. No index signature found with a parameter of this type.",
    buttonText: "routes['home']",
  },
];

export default function NotFoundPage() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const hash = Array.from(pathname).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );
  const randomError = errorMessages[hash % errorMessages.length];

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-8">
        <h1
          className="mb-2 font-mono text-8xl tracking-wider opacity-20 sm:text-9xl"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          404
        </h1>
        <div className="space-y-4">
          <p className="text-2xl font-medium sm:text-3xl">
            {randomError.title}
          </p>
          <p className="mx-auto max-w-md text-lg text-gray-600 dark:text-gray-400">
            {randomError.description}
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm text-gray-500 dark:text-gray-500">
            (This is not a real error. You landed on a page that doesn&apos;t
            exist.)
          </p>
        </div>
      </div>

      <Link
        to="/"
        className="mt-4 border border-gray-900 px-6 py-3 transition-colors duration-200 hover:bg-gray-900 hover:text-white dark:border-gray-100 dark:hover:bg-gray-100 dark:hover:text-gray-900"
      >
        {randomError.buttonText}
      </Link>
    </div>
  );
}
