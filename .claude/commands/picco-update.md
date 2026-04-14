Aggiorna il minValue dell'edizione corrente in `picco.js` con il valore `$ARGUMENTS`.

Passi:

1. Leggi `model.js` per trovare `defaultAnnoGenesi` (l'edizione corrente).
2. Leggi `picco.js` e individua il blocco dell'edizione corrente.
3. Commenta la riga `minValue` attiva (aggiungi `// ` davanti) e aggiungi subito dopo una nuova riga:
   `minValue: $ARGUMENTS, // GG mese YYYY, HH.MM`
   - La data è quella attuale in italiano (es. `16 dicembre 2024, 01.58`), ora locale con `.` come separatore dei minuti.
   - Assicurati che il formato sia coerente con le righe precedenti nello stesso blocco.
4. Esegui `npm test` e verifica che non ci siano errori (i warning preesistenti su `index.js` sono accettabili).
5. Committa `picco.js` con il messaggio:
   `picco<EDIZIONE>: minValue: $ARGUMENTS // <data>`
   seguito da `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`.
