# aegix.eu

Temporary holding page for aegix.eu, served by GitHub Pages. It stands in until
the full product site replaces it.

One `index.html` and one photograph. No build step, no dependencies, no
JavaScript, about 60 KB.

## The photograph

`hero-earth.jpg` is NASA's `art002e004450`, a crescent Earth from Artemis II.

NASA states its still images are generally not subject to copyright in the US
and may be used commercially, on two conditions that matter here: nothing may
imply NASA endorses the product, and extra clearance is needed where NASA
insignia, logos or identifiable people appear. This frame has none of those.

**Do not swap in a photograph from Flickr without checking its licence.** NASA's
Flickr uploads are frequently CC BY-NC-ND 4.0, which forbids both commercial use
and modification — the opposite of the terms on nasa.gov for the same image.

## Custom domain

1. At the registrar, remove any parking record and URL forwarding first.
2. `aegix.eu` → **ALIAS** → `xwarestack.github.io`
   `www` → **CNAME** → `xwarestack.github.io`
   The target is the organisation's Pages host, not this repository's name.
3. Once that resolves, set the custom domain under **Settings → Pages**. GitHub
   writes a `CNAME` file into the repository; leave it there, or the next deploy
   drops the domain.
4. Tick **Enforce HTTPS** when the certificate has been issued.

## Before it is announced

- `hello@aegix.eu` appears twice on the page and must be a mailbox someone
  reads. A bounce is worse than no address.
- `<meta name="robots" content="noindex">` is set deliberately; remove it when
  the real site ships.
