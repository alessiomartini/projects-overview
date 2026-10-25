---
title: "Cassaforte dati personali"
status: idea
kind: dati
summary: "Un posto unico e cifrato per i dati personali (BSN, indirizzo, IBAN, documenti, codici) al posto delle note di Google Keep."
tags: [dati-personali, sicurezza, locale]
---

## Idea

Una pagina HTML locale con tutti i miei dati personali sempre a portata di mano: BSN, codice
fiscale, indirizzi, IBAN, numeri di documenti, tessere, codici e magari password. Meglio se
cifrata. Così smetto di tenerli in Google Keep, che non è cifrato.

## Note iniziali

- **Prima di scrivere codice, valutare un password manager**, che fa già tutto questo: cifratura
  seria, note sicure e campi personalizzati, app sul telefono, autofill. Per esempio **KeePassXC**
  (file `.kdbx` locale, open source, gratis, si apre anche dal telefono con KeePassDX o Strongbox)
  oppure **Bitwarden** (cloud, piano gratuito). Fare la crittografia "in casa" è il punto debole
  tipico.
- Se vale comunque la pena farla: un solo file HTML offline, dati cifrati con WebCrypto
  (AES-GCM, chiave da una passphrase via PBKDF2 o Argon2), nessun server, nessun dato in chiaro
  su disco.
- I dati veri **non vanno mai in git** né nel cloud in chiaro. Il loro posto è
  `E:\Alessio\Dati-personali`, come gli altri export personali.
- Migrazione: copiare da Google Keep e poi cancellare le note da lì.
