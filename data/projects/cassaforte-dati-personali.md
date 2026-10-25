---
title: "Cassaforte dati personali (KeePassXC)"
status: in-corso
kind: dati
summary: "Dati personali (BSN, indirizzo, IBAN, documenti, codici) e password in un database KeePassXC cifrato, al posto delle note di Google Keep."
tags: [dati-personali, sicurezza, password-manager]
started: 2026-10-25
---

## Da fare

- [x] Scegliere lo strumento: KeePassXC invece di una pagina HTML fatta in casa
- [x] Installare l'app sul telefono (KeePassDX su Android)
- [x] Installare KeePassXC sul PC (https://keepassxc.org)
- [x] Creare il database `.kdbx` (`E:\Alessio\Dati-personali\personale.kdbx`, banche importate)
- [ ] Gruppi: Identità (BSN, codice fiscale, passaporto/carta d'identità, DigiD/SPID), Indirizzi, Banche (IBAN), Assicurazioni (VGZbewuzt), Abbonamenti, Password
- [ ] Spostare tutto da Google Keep, poi cancellare quelle note da Keep (e svuotare il cestino)
- [ ] Sincronizzare il file tra PC e telefono (Dropbox, oppure Syncthing per non metterlo nel cloud)
- [ ] Backup: una copia del `.kdbx` su chiavetta o disco esterno

## Note

- Il file `.kdbx` è cifrato, quindi può stare anche su Dropbox. La passphrase invece non deve
  mai finire online.
- Niente dati veri in git o in questo repo.

## Log

- 2026-10-25: creato `personale.kdbx` con keepassxc-cli (import da XML con `-p`, poi file in chiaro sovrascritto e cancellato). Dentro: 5 conti bancari, gruppi Identità/Indirizzi/Assicurazioni/Account vuoti.
- 2026-10-25: idea iniziale (una pagina HTML locale cifrata) trasformata nell'uso di KeePassXC. App scaricata sul telefono.
