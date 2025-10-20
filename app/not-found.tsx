import Link from 'next/link';

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
      "The requested module './page' was not found. Verify that the path is correct and that the file exists in your working directory.",
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
      "Conversion of type 'string' to type 'Page' may be a mistake. Neither type sufficiently overlaps with the other. Perhaps you meant to navigate elsewhere?",
    buttonText: 'home as unknown as Page',
  },
  {
    title: 'Index signature is missing',
    description:
      "Element implicitly has an 'any' type because expression of type '404' can't be used to index type 'Routes'. No index signature found with a parameter of this type.",
    buttonText: "routes['home']",
  },
];

export default function NotFound() {
  const randomError =
    errorMessages[Math.floor(Math.random() * errorMessages.length)];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="mb-8">
        <h1
          className="text-8xl sm:text-9xl font-mono tracking-wider mb-2 opacity-20"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          404
        </h1>
        <div className="space-y-4">
          <p className="text-2xl sm:text-3xl font-medium">
            {randomError.title}
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {randomError.description}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 max-w-md mx-auto mt-4">
            (This is not a real error. You landed on a page that doesn&apos;t
            exist.)
          </p>
        </div>
      </div>

      <Link
        href="/"
        className="mt-4 px-6 py-3 border border-gray-900 dark:border-gray-100 hover:bg-gray-900 hover:text-white dark:hover:bg-gray-100 dark:hover:text-gray-900 transition-colors duration-200"
      >
        {randomError.buttonText}
      </Link>
    </div>
  );
}
