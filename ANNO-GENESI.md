# Anno Genesi

## Stato

Proposta e convenzione utilizzata dal progetto [Picco Bitcoin](https://isghe.github.io/picco-bitcoin/).

## Definizione

L'**Anno Genesi**, abbreviato **AG**, è una numerazione degli anni di Bitcoin che assume come origine il blocco genesi.

L'**AG 1** inizia con il timestamp del blocco genesi di Bitcoin:

> 3 gennaio 2009, 18:15:05 UTC  
> Unix time `1231006505`

Ogni Anno Genesi successivo inizia all'anniversario di questo istante. Gli intervalli sono chiusi a sinistra e aperti a destra:

| Anno Genesi | Inizio (UTC) | Fine esclusa (UTC) |
|---:|---|---|
| AG 1 | 3 gennaio 2009, 18:15:05 | 3 gennaio 2010, 18:15:05 |
| AG 12 | 3 gennaio 2020, 18:15:05 | 3 gennaio 2021, 18:15:05 |
| AG 18 | 3 gennaio 2026, 18:15:05 | 3 gennaio 2027, 18:15:05 |

Gli istanti precedenti al blocco genesi non appartengono ad alcun Anno Genesi. Non è previsto un **AG 0**.

## Notazione

Sono consigliate le forme:

- **Anno Genesi 18**, nel testo esteso;
- **AG 18**, nella forma abbreviata;
- **18 AG**, quando il numero precede l'indicazione dell'era.

La forma `#picco18` identifica l'edizione di Picco Bitcoin che si svolge durante l'AG 18.

## Conversione

Per un istante appartenente all'anno gregoriano `Y`:

- dall'anniversario del 3 gennaio alle 18:15:05 UTC in poi: `AG = Y - 2008`;
- prima dell'anniversario: `AG = Y - 2009`.

Esempi:

| Istante (UTC) | Anno Genesi |
|---|---:|
| 3 gennaio 2009, 18:15:04 | non definito |
| 3 gennaio 2009, 18:15:05 | AG 1 |
| 1 gennaio 2026, 00:00:00 | AG 17 |
| 3 gennaio 2026, 18:15:05 | AG 18 |
| 26 agosto 2026 | AG 18 |

## Rapporto con il calendario civile

L'Anno Genesi non sostituisce il calendario gregoriano e non modifica mesi, settimane o giorni. Cambia soltanto l'origine e il momento di passaggio al nuovo anno.

La sua durata coincide con quella compresa fra due anniversari gregoriani consecutivi e può quindi essere di 365 o 366 giorni.

## Precisione adottata da Picco Bitcoin

Le regole storiche di Picco Bitcoin indicano gli estremi al minuto, dalle **18:15 UTC** del 3 gennaio alle **18:14 UTC** del 3 gennaio successivo. Questa è una rappresentazione operativa arrotondata al minuto.

Quando è necessaria la precisione al secondo, questa definizione utilizza il timestamp contenuto nell'intestazione del blocco genesi: **18:15:05 UTC**.

## Origine della convenzione

La denominazione **Anno Genesi (AG)** è documentata pubblicamente nel repository Picco Bitcoin almeno dalla [commit del 27 dicembre 2019](https://github.com/isghe/picco-bitcoin/commit/8b52e9d), quando fu utilizzata per definire l'edizione `#picco12`:

> Viene denominato `#picco12` perché si svolgerà nell'Anno Genesi (AG) 12 dal blocco genesi di Bitcoin.

La numerazione è stata poi mantenuta nelle edizioni successive della competizione.

## Scopo

Anno Genesi offre un modo breve e immediatamente riconoscibile per indicare gli anni trascorsi dalla nascita operativa di Bitcoin. È una convenzione culturale e cronologica: non modifica il protocollo Bitcoin, il consenso, i timestamp dei blocchi o la loro altezza.
