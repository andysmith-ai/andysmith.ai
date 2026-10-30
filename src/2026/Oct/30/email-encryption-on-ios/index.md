---
title: "Email Encryption on iOS"
type: post
description: "A practical account of S/MIME interoperability limits between Apple Mail and Thunderbird, explaining why shared email encryption requires weaker RSA PKCS#1 v1.5 while EC keys still work for digital signatures."
date: 2026-10-30T23:15:33+07:00
announcements:
  bluesky: "It turns out that the default Apple Mail app is very finicky about encryption."
---

It turns out that the default Apple Mail app is very finicky about encryption.

I have several Apple devices and Thunderbird on my computer. It is recommended to separate encryption and signing keys, make signing keys unique to each device, and use the same encryption keys on all devices while rotating them more often. This is a strange practice in my view, but it is what it is. Otherwise, one device cannot decrypt messages sent to the other devices, and I could not find a way to use several encryption certificates for one address.

Here is what I found while trying to set up an encryption certificate shared with Thunderbird:

1. Thunderbird supports EC keys but uses sha256kdf/sha384kdf. Apple only supports sha1kdf, which Thunderbird does not support. The conclusion is that EC will not work in a setup with Apple.
2. Both Thunderbird and Apple support RSA, but only RSA PKCS#1 v1.5, not RSA-OAEP. This is weaker encryption and is not resistant to the Bleichenbacher attack. When an RSA key is selected, Thunderbird uses RSA PKCS#1 v1.5.

I had to use RSA PKCS#1 v1.5 for encryption so that I could decrypt email on my iPhone and iPad. I trust third-party clients even less.

Digital signatures work correctly with EC keys, so these workarounds do not apply to signing.

Links referenced by the agents:

- https://github.com/apple-oss-distributions/Security/blob/Security-61901.101.4/libsecurity_smime/lib/crypto-embedded.c#L508-L519
- https://inside.indeno.at/apple-mail-kann-keine-s-mime-nachrichten-mit-rsaes-oaep-entschlusseln/
- https://docs.seppmail.com/en/09_ht_encryption_applemail-smime-rsaes-oaep.html
- https://www.ssl.com/how-to/ios-smime-email-installation/
- https://www.rfc-editor.org/rfc/rfc8551#section-3.3
