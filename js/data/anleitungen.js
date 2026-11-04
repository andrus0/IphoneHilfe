(function () {
  'use strict';
  var IH = window.IH = window.IH || {};

  // Bereiche der Startseite (max. 6)
  IH.BEREICHE = [
    { id: 'telefon', titel: 'Telefon & Kontakte', emoji: '📞' },
    { id: 'whatsapp', titel: 'WhatsApp', emoji: '💬' },
    { id: 'fotos', titel: 'Fotos', emoji: '📷' },
    { id: 'grundlagen', titel: 'iPhone-Grundlagen', emoji: '📱' },
    { id: 'echt', titel: 'Ist das echt?', emoji: '🛑' },
    { id: 'hilfe', titel: 'Hilfe holen', emoji: '🆘' }
  ];

  // Schritt: {text, bild, nur?: 'faceid' | 'homebutton'}
  IH.ANLEITUNGEN = [
    {
      id: 'welches-iphone', titel: 'Welches iPhone habe ich?', emoji: '🔍', bereich: 'grundlagen',
      schritte: [
        { bild: '⚙️', text: 'Tippe auf das graue Zahnrad. Es heißt „Einstellungen“.' },
        { bild: '👆', text: 'Wische mit dem Finger nach oben. Tippe auf „Allgemein“.' },
        { bild: 'ℹ️', text: 'Tippe ganz oben auf „Info“.' },
        { bild: '📱', text: 'Bei „Modellname“ steht, welches iPhone du hast.' },
        { bild: '🔢', text: 'Bei „iOS-Version“ steht die Nummer deiner Software.' },
        { bild: '🔘', nur: 'homebutton', text: 'Du hast unten einen runden Knopf. Das ist der Home-Knopf.' },
        { bild: '✨', nur: 'faceid', text: 'Du hast unten keinen Knopf. Dein iPhone erkennt dein Gesicht.' }
      ]
    },
    {
      id: 'lautstaerke', titel: 'Lauter und leiser, Stummschalter', emoji: '🔊', bereich: 'grundlagen',
      schritte: [
        { bild: '👈', text: 'Schau auf die linke Seite vom iPhone. Dort sind zwei Tasten.' },
        { bild: '➕', text: 'Obere Taste drücken: Es wird lauter.' },
        { bild: '➖', text: 'Untere Taste drücken: Es wird leiser.' },
        { bild: '📊', text: 'Auf dem Bildschirm siehst du einen Balken. Er zeigt, wie laut es ist.' },
        { bild: '🔕', text: 'Ganz oben an der linken Seite ist ein kleiner Schalter. Zeigt er einen orangen Streifen, ist dein iPhone lautlos.' },
        { bild: '🔔', text: 'Schiebe den Schalter zurück. Dann klingelt das iPhone wieder.' },
        { bild: '🔘', text: 'Manche neue iPhones haben statt des Schalters eine kleine Taste. Halte sie kurz gedrückt, dann wechselt der Ton.' }
      ]
    },
    {
      id: 'anrufen', titel: 'Anrufen und Anruf annehmen', emoji: '📞', bereich: 'telefon',
      schritte: [
        { bild: '📞', text: 'Tippe auf das grüne Symbol mit dem Telefonhörer. Es heißt „Telefon“.' },
        { bild: '👤', text: 'Tippe unten auf „Kontakte“.' },
        { bild: '👆', text: 'Tippe auf den Namen der Person.' },
        { bild: '🟢', text: 'Tippe auf „Anrufen“. Warte, bis es klingelt.' },
        { bild: '🔴', text: 'Zum Beenden tippe auf den roten Knopf.' },
        { bild: '📲', text: 'Wenn dich jemand anruft: Siehst du einen grünen Knopf, tippe darauf.' },
        { bild: '👉', text: 'Siehst du stattdessen einen Regler, schiebe ihn mit dem Finger nach rechts.' },
        { bild: '🔈', text: 'Möchtest du freihändig sprechen, tippe auf „Lautsprecher“.' }
      ]
    },
    {
      id: 'kontakt-speichern', titel: 'Kontakt speichern', emoji: '👤', bereich: 'telefon',
      schritte: [
        { bild: '📞', text: 'Tippe auf das grüne Telefon-Symbol.' },
        { bild: '👤', text: 'Tippe unten auf „Kontakte“.' },
        { bild: '➕', text: 'Tippe oben rechts auf das Plus.' },
        { bild: '✏️', text: 'Tippe auf „Vorname“ und schreibe den Namen.' },
        { bild: '🔢', text: 'Tippe auf „Telefon hinzufügen“ und schreibe die Nummer.' },
        { bild: '✅', text: 'Tippe oben rechts auf „Fertig“. Der Kontakt ist gespeichert.' },
        { bild: '🕘', text: 'Tipp: Hat dich jemand angerufen, tippe unten auf „Anrufe“. Tippe beim Anruf auf das kleine i und dann auf „Neuen Kontakt erstellen“.' }
      ]
    },
    {
      id: 'whatsapp-nachricht', titel: 'WhatsApp: Nachricht und Sprachnachricht', emoji: '💬', bereich: 'whatsapp',
      schritte: [
        { bild: '💬', text: 'Tippe auf das grüne Symbol mit dem Telefonhörer. Es heißt „WhatsApp“.' },
        { bild: '👆', text: 'Tippe in der Liste auf den Namen der Person.' },
        { bild: '⌨️', text: 'Tippe unten auf das Feld und schreibe deine Nachricht.' },
        { bild: '➡️', text: 'Tippe auf den grünen Pfeil. Die Nachricht ist gesendet.' },
        { bild: '🎤', text: 'Sprechen geht auch: Drücke rechts auf das Mikrofon und halte den Finger drauf.' },
        { bild: '🗣️', text: 'Sprich jetzt. Lass dann los. Die Sprachnachricht wird gesendet.' },
        { bild: '↩️', text: 'Falsch gesprochen? Wische mit dem Finger nach links, bevor du loslässt. Dann wird sie gelöscht.' }
      ]
    },
    {
      id: 'foto-schicken', titel: 'Foto machen und per WhatsApp schicken', emoji: '📷', bereich: 'fotos', auch: ['whatsapp'],
      schritte: [
        { bild: '📷', text: 'Tippe auf das graue Symbol mit der Kamera. Es heißt „Kamera“.' },
        { bild: '🖼️', text: 'Halte das iPhone ruhig auf das, was du fotografieren möchtest.' },
        { bild: '⚪', text: 'Tippe unten auf den großen runden Knopf. Das Foto ist gemacht.' },
        { bild: '🌄', text: 'Gehe zurück zum Start. Tippe auf das bunte Blumen-Symbol „Fotos“.' },
        { bild: '👆', text: 'Tippe auf das Foto, das du schicken willst.' },
        { bild: '📤', text: 'Tippe unten links auf das Viereck mit dem Pfeil nach oben.' },
        { bild: '💬', text: 'Tippe auf „WhatsApp“. Siehst du es nicht, wische nach links und tippe auf „Mehr“.' },
        { bild: '👤', text: 'Tippe auf den Namen der Person. Tippe dann auf „Weiter“.' },
        { bild: '➡️', text: 'Tippe auf den grünen Pfeil. Das Foto ist unterwegs.' },
        { bild: '🏠', nur: 'faceid', text: 'Zurück zum Start: Wische mit dem Finger von ganz unten nach oben.' },
        { bild: '🏠', nur: 'homebutton', text: 'Zurück zum Start: Drücke den runden Knopf unten.' }
      ]
    },
    {
      id: 'app-installieren', titel: 'App aus dem App Store holen', emoji: '⬇️', bereich: 'grundlagen',
      schritte: [
        { bild: '🅰️', text: 'Tippe auf das blaue Symbol mit dem weißen A. Es heißt „App Store“.' },
        { bild: '🔎', text: 'Tippe unten auf „Suchen“.' },
        { bild: '⌨️', text: 'Tippe oben auf das Suchfeld. Schreibe den Namen der App.' },
        { bild: '👆', text: 'Tippe auf die App in der Liste. Schau auf den Namen: Er muss genau stimmen.' },
        { bild: '⬇️', text: 'Tippe neben der App auf „Laden“. Siehst du eine kleine Wolke, tippe auf die Wolke.' },
        { bild: '✨', nur: 'faceid', text: 'Drücke zweimal schnell die Taste rechts an der Seite. Schau dann auf dein iPhone.' },
        { bild: '👆', nur: 'homebutton', text: 'Lege den Finger auf den runden Knopf unten. Warte kurz.' },
        { bild: '🔑', text: 'Fragt das iPhone nach einem Passwort, gib dein Apple-Passwort ein. Das Passwort sagst du niemandem.' },
        { bild: '⏳', text: 'Warte, bis „Öffnen“ erscheint. Die App liegt jetzt auf deinem Bildschirm.' }
      ]
    },
    {
      id: 'aufraeumen', titel: 'Bildschirm aufräumen und Schrift größer', emoji: '🔠', bereich: 'grundlagen',
      schritte: [
        { bild: '👆', text: 'Lege den Finger auf eine freie Stelle im Bildschirm. Halte ihn gedrückt, bis alle Symbole wackeln.' },
        { bild: '↔️', text: 'Lege den Finger auf ein Symbol. Ziehe es an einen neuen Platz und lass los.' },
        { bild: '➖', text: 'Eine App brauchst du nicht? Tippe oben links an der App auf das Minus.' },
        { bild: '🗂️', text: 'Tippe auf „Aus Home-Bildschirm entfernen“. Tippe nicht auf „App löschen“. Sonst ist die App weg.' },
        { bild: '✅', nur: 'faceid', text: 'Fertig? Tippe oben rechts auf „Fertig“.' },
        { bild: '🔘', nur: 'homebutton', text: 'Fertig? Drücke den runden Knopf unten.' },
        { bild: '⚙️', text: 'Für größere Schrift tippe auf das graue Zahnrad „Einstellungen“.' },
        { bild: '🔆', text: 'Tippe auf „Anzeige & Helligkeit“. Tippe dann auf „Textgröße“.' },
        { bild: '🔠', text: 'Schiebe den Regler mit dem Finger nach rechts. Die Schrift wird größer.' },
        { bild: '🅱️', text: 'Für dickere Schrift gehe zurück. Schalte „Fettschrift“ ein.' }
      ]
    },
    {
      id: 'fernhilfe', titel: 'Bildschirm per FaceTime teilen', emoji: '🆘', bereich: 'hilfe',
      schritte: [
        { bild: '📞', text: 'Verabrede dich mit deinem Helfer. Er ruft dich über „FaceTime“ an. Das ist das grüne Symbol mit der Kamera.' },
        { bild: '🟢', text: 'Es klingelt. Tippe auf den grünen Knopf „Annehmen“.' },
        { bild: '👆', text: 'Tippe einmal auf den Bildschirm, damit unten die Knöpfe erscheinen.' },
        { bild: '🖥️', text: 'Tippe auf das Symbol mit dem Rechteck und der Person. Es heißt „Teilen“. Siehst du es nicht, tippe zuerst auf „SharePlay“ oder die Pfeil-Taste.' },
        { bild: '📲', text: 'Tippe auf „Meinen Bildschirm teilen“.' },
        { bild: '👀', text: 'Nach drei Sekunden sieht dein Helfer, was auf deinem Bildschirm ist. Er kann dir sagen, wo du tippen sollst.' },
        { bild: '🔒', text: 'Fragt das iPhone, ob dein Helfer etwas steuern darf? Tippe nur auf „Erlauben“, wenn du die Person gut kennst.' },
        { bild: '🔴', text: 'Zum Beenden tippe oben auf das Symbol für das Teilen. Tippe dann auf „Teilen beenden“. Zum Auflegen tippe auf den roten Knopf.' }
      ]
    },
    {
      id: 'echt', titel: 'Ist das echt? Die goldene Regel', emoji: '🛑', bereich: 'echt',
      schritte: [
        { bild: '🛑', text: 'Im Zweifel: Tippe auf nichts. Lösche die Nachricht oder lege auf.' },
        { bild: '📞', text: 'Rufe jemanden an, den du kennst. Zum Beispiel dein Kind. Frage: „Ist das echt?“' },
        { bild: '🏦', text: 'Deine Bank, Apple, die Post und die Polizei fragen dich nie per SMS oder WhatsApp nach Passwort, Geld oder Zahlen.' },
        { bild: '🔢', text: 'Sage am Telefon nie Zahlen-Codes weiter. Auch nicht, wenn jemand freundlich ist.' },
        { bild: '💶', text: 'Überweise nie Geld wegen einer Nachricht. Zuerst anrufen.' },
        { bild: '⏰', text: 'Echte Hilfe hat Zeit. Wer Druck macht oder „sofort“ sagt, will dich täuschen.' }
      ]
    }
  ];

  // Betrugsfallen im Bereich „Ist das echt?“ (genau 5)
  IH.FALLEN = [
    {
      id: 'sms-paket', titel: 'SMS: Paket oder Bank', emoji: '📦',
      erkennen: [
        'Eine SMS sagt: „Dein Paket wartet“ oder „Dein Konto ist gesperrt“.',
        'In der SMS ist ein Link zum Antippen.',
        'Du hast gar kein Paket erwartet.',
        'Die Nachricht macht Druck: „Sofort handeln!“'
      ],
      tun: [
        'Tippe nicht auf den Link.',
        'Gib nirgends Zahlen oder Passwörter ein.',
        'Lösche die Nachricht.',
        'Unsicher? Rufe die Bank unter der Nummer auf deiner Bankkarte an.'
      ]
    },
    {
      id: 'hallo-mama', titel: 'Hallo Mama, neue Nummer', emoji: '👋',
      erkennen: [
        'Eine fremde Nummer schreibt: „Hallo Mama, ich habe eine neue Nummer.“',
        'Kurz danach bittet die Person um Geld. Zum Beispiel für eine Rechnung.',
        'Die Person will nicht anrufen. Sie hat angeblich ein kaputtes Handy.'
      ],
      tun: [
        'Überweise kein Geld.',
        'Rufe dein Kind unter der alten Nummer an, die du schon kennst.',
        'Antworte der fremden Nummer nicht.',
        'Sage deiner Familie Bescheid.'
      ]
    },
    {
      id: 'apple-falsch', titel: 'Falsche Apple-Mail oder Anruf', emoji: '🍎',
      erkennen: [
        'Eine Mail oder ein Anruf sagt: „Dein Apple-Konto ist in Gefahr.“',
        'Jemand am Telefon sagt, er sei von Apple oder Microsoft.',
        'Du sollst ein Passwort oder einen Code nennen.',
        'Du sollst eine App laden, damit jemand auf dein Gerät schaut.'
      ],
      tun: [
        'Lege sofort auf. Apple ruft dich nicht ungefragt an.',
        'Tippe nicht auf Links in der Mail.',
        'Nenne niemals dein Passwort oder einen Code.',
        'Lösche die Mail.'
      ]
    },
    {
      id: 'abo-falle', titel: 'Abo-Falle', emoji: '💸',
      erkennen: [
        'Eine Seite oder App verspricht etwas „Gratis“. Zum Beispiel ein Gewinn oder ein Test.',
        'Du sollst deine Daten oder Karte eingeben.',
        'Das Kleingedruckte nennt ein Abo mit Kosten.',
        'Kurz danach steht eine Abbuchung auf deinem Konto.'
      ],
      tun: [
        'Gib nichts ein und schließe die Seite.',
        'Wurde schon etwas abgebucht, zeige es deinem Kind oder deiner Bank.',
        'Abos prüfst du so: Einstellungen, oben auf deinen Namen tippen, „Abonnements“.',
        'Im Zweifel: ein Angehöriger schaut mit dir nach.'
      ]
    },
    {
      id: 'virus-popup', titel: 'Pop-up „Virus gefunden“', emoji: '🦠',
      erkennen: [
        'Beim Surfen springt ein Fenster auf: „Dein iPhone hat einen Virus!“',
        'Es blinkt, piept oder zeigt eine Warnung in Rot.',
        'Du sollst eine Nummer anrufen oder eine App laden.'
      ],
      tun: [
        'Rufe keine Nummer an. Lade keine App.',
        'Schließe das Fenster mit dem kleinen X. Klappt das nicht, schließe Safari und öffne es neu.',
        'Das Fenster ist nur Werbung. Dein iPhone hat keinen Virus.',
        'Hilft das nicht, rufe dein Kind an.'
      ]
    }
  ];

  // Anleitung zum ersten Start im Browser
  IH.HOMESCREEN = {
    titel: 'Zum Home-Bildschirm legen',
    emoji: '📲',
    schritte: [
      { bild: '🧭', text: 'Öffne diese Seite in „Safari“. Das ist das blaue Symbol mit dem Kompass.' },
      { bild: '📤', text: 'Tippe auf den Teilen-Knopf. Er sieht aus wie ein Viereck mit einem Pfeil nach oben. Siehst du ihn nicht, tippe erst auf die drei Punkte.' },
      { bild: '👆', text: 'Wische mit dem Finger nach oben. Tippe auf „Zum Home-Bildschirm“.' },
      { bild: '✅', text: 'Tippe oben rechts auf „Hinzufügen“.' },
      { bild: '🏠', text: 'Schließe Safari. Tippe auf das neue Symbol „iPhone-Hilfe“ auf deinem Bildschirm.' }
    ]
  };
})();
