/**
 * Renders a JSON-LD block. Server component on purpose — structured data must
 * be present in the initial HTML, since Google's structured-data parsing does
 * not wait for client hydration.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // Content is authored by us, never user input, so there is nothing to
      // escape beyond closing-tag injection, which JSON.stringify cannot emit.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
