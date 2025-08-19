import ReactMarkdown from 'react-markdown';

export function MarkdownBlock({ text }: { text: string }) {
  return (
    <ReactMarkdown
      components={{
        a: ({ children, ...props }) => (
          <a
            className="font-medium text-primary underline underline-offset-4"
            target="_blank"
            {...props}
          >
            {children}
          </a>
        ),
        ul: (props) => <ul className="ml-4 list-disc space-y-2" {...props} />,
        ol: (props) => (
          <ol className="ml-4 list-decimal space-y-2" {...props} />
        ),
        p: (props) => <p {...props} />,
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
