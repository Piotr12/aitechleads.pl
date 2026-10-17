export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:px-6">
        <p>
          <strong className="font-medium text-foreground">Not affiliated.</strong> aitechleads.pl is
          a community collaboration space. It is in no way connected with, endorsed by or run by the
          AI Tech Leaders training (aitechleaders.pl). We&apos;re not the Messiah, we&apos;re just a
          bunch of very naughty tech leads.
        </p>
        {/* Invisible, but still spoken: select the line to read it. */}
        <p className="text-transparent" title="A man is not dead while his name is still spoken.">
          GNU Terry Pratchett
        </p>
      </div>
    </footer>
  );
}
