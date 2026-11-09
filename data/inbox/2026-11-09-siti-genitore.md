---
date: "2026-11-09"
---
Siti genitore: raggruppare i cataloghi (music-library, film-salvati, il sito dei libri che ancora non esiste) e le mappe (mountain-huts-map, eating-amsterdam), invece di tanti siti sparsi. Proposta, niente costruito.

**Opzione A, pagina-indice (landing) che rimanda ai figli.** Una pagina statica "Cataloghi" e una "Mappe" (due card ciascuna, con titolo, numero di voci e link). I siti restano repo e URL separati, con il loro stack (music-library Vite, film-salvati statico, mountain-huts-map Astro su Cloudflare, eating-amsterdam statico). Ogni figlio ha già il link in basso a destra verso sito personale e lista progetti (widget note v3); basta aggiungere un terzo link "Cataloghi"/"Mappe".
- Pro: costa poco (una pagina per genitore), non rompe URL e deep link, ogni sito si evolve da solo, nessuna migrazione dei dati.
- Contro: i figli restano visivamente diversi; nessuna ricerca trasversale ("tutto quello che ho visto/letto/ascoltato").

**Opzione B, sito unico fuso** (un'app con sezioni Musica / Film / Libri e un'altra con le mappe). Una sola UI e un solo schema di voce (titolo, anno, rating, tag, stato).
- Pro: ricerca e filtri comuni, coerenza grafica, un solo deploy per famiglia.
- Contro: lavoro grosso (riscrivere almeno music-library, che ha una pipeline offline e molti dati); URL e repo da cambiare (i repo su GitHub Pages non si rinominano, nessun redirect); mappe con stack e hosting diversi (Workers vs Pages), rischio di appesantire le mappe.

**Opzione C, ibrida: landing + tema condiviso.** Come A, più un piccolo CSS/JS comune (barra superiore con "Cataloghi: Musica · Film · Libri") copiato nei figli come già si fa col widget note. Nessuna fusione di codice.
- Pro: i figli sembrano una famiglia, si può passare da uno all'altro in un tocco; il costo resta basso.
- Contro: un asset condiviso in più da tenere allineato (copie identiche, `?v=` da alzare).

**Raccomandazione.** Opzione A subito (le due landing, `cataloghi` e `mappe`, come pagine nel repo del sito personale o in un repo piccolo), poi C quando esiste il sito dei libri, così la barra nasce con tre voci. B solo se emerge il bisogno vero di ricerca trasversale: in quel caso partire da uno schema comune dei dati catalogo, non dal codice. Intanto: il sito dei libri (idea già in Inbox, 2026-11-07) conviene crearlo sul modello di film-salvati, così gli schemi sono già compatibili.

Domanda aperta: dove ospitare le landing (nel sito personale o repo dedicato) e se in `projects-overview` i gruppi vanno mostrati come un campo `parent:` nelle schede.
