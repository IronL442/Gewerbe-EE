import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Datenschutzerklärung</h1>

      <p className="text-sm text-gray-600 mb-6">Stand: September 2025</p>

      <p className="mb-4">
        Diese Web-Anwendung dient der Planung, Dokumentation und Abrechnung von
        Lern- und Unterrichtseinheiten. Sie wird als interne Lösung betrieben und
        ist für die Nutzung durch berechtigte Mitarbeiter konzipiert. Nachfolgend
        informieren wir über Art, Umfang und Zweck der Verarbeitung
        personenbezogener Daten sowie über die eingesetzte technische
        Infrastruktur.
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">1. Verantwortlicher</h2>
        <p>
          Verantwortliche Stelle im Sinne der DSGVO:<br />
          <strong>Laurits Eisengarten</strong><br />
          Domblik 29<br />
          51381 Leverkusen<br />
          E-Mail: <a className="text-blue-600" href="mailto:[info@eisengarten.eu]">info@eisengarten.eu</a><br />
        </p>
      </section>

      <section className="space-y-3 mt-6">
        <h2 className="text-xl font-semibold">2. Technische Plattform</h2>
        <p>
          Die Anwendung besteht aus einem React-Frontend (Vite) und einem Flask
          Backend, die innerhalb einer Docker-Infrastruktur betrieben werden.
          Alle Daten werden in einer PostgreSQL-Datenbank gespeichert. Digitale
          Unterschriften werden als PDF-Datei generiert und in Cloudflare R2
          (europäischer Speicherort) archiviert. Sofern R2 vorübergehend nicht
          erreichbar ist, erfolgt eine verschlüsselte Zwischenspeicherung auf dem
          Server. Zur
          Fakturierung wird optional der Drittanbieter <strong>FastBill </strong>
          angebunden.
        </p>
      </section>

      <section className="space-y-3 mt-6">
        <h2 className="text-xl font-semibold">3. Verarbeitete Daten</h2>
        <div>
          <p className="font-semibold">a) Benutzer- und Zugriffsdaten</p>
          <ul className="list-disc list-inside ml-3">
            <li>Login-Daten der Mitarbeitenden (Benutzername, Passwort-Hash).</li>
            <li>Session-Cookies (Flask-Session, CSRF-Token) zur Absicherung des Logins.</li>
            <li>Technische Protokolldaten (Zeitpunkt, HTTP-Status) in Server-Logs.</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">b) Kundendaten</p>
          <ul className="list-disc list-inside ml-3">
            <li>Vor- und Nachname, optionale Kontaktdaten (E-Mail, Telefon, Adresse).</li>
            <li>Zugehörige Schüler*innen sowie interne Kundennummern.</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">c) Schüler- und Sitzungsdaten</p>
          <ul className="list-disc list-inside ml-3">
            <li>Vor- und Nachname des Schülers, Zuordnung zu Kund*innen.</li>
            <li>Sitzungsdatum, Start- und Endzeit, Thema/Inhalt der Stunde.</li>
            <li>PDF-Protokoll der Sitzung inklusive digitaler Unterschrift.</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">d) Rechnungsdaten (optional)</p>
          <ul className="list-disc list-inside ml-3">
            <li>Übermittlung relevanter Kundendaten und Leistungsnachweise an FastBill.</li>
          </ul>
        </div>
        <p>
          Rechtsgrundlage der Verarbeitung ist Art. 6 Abs. 1 lit. b DSGVO
          (Vertragserfüllung) sowie Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
          Interesse an einer effizienten Verwaltung). Für die Erfassung der
          digitalen Unterschrift holen wir eine Einwilligung nach Art. 6 Abs. 1
          lit. a DSGVO ein.
        </p>
      </section>

      <section className="space-y-3 mt-6">
        <h2 className="text-xl font-semibold">4. Cookies & Tracking</h2>
        <p>
          Die Anwendung nutzt ausschließlich technisch notwendige Cookies:
        </p>
        <ul className="list-disc list-inside ml-3">
          <li>
            <strong>Session-Cookies</strong> (Secure, HttpOnly) zur Aufrechterhaltung
            der Anmeldung.
          </li>
          <li>
            <strong>CSRF-Cookies</strong> (Secure, HttpOnly) zum Schutz vor Cross-Site-
            Request-Forgery-Angriffen.
          </li>
        </ul>
        <p>Es werden keine Analyse-, Tracking- oder Werbung-Cookies gesetzt.</p>
      </section>

      <section className="space-y-3 mt-6">
        <h2 className="text-xl font-semibold">5. Empfänger & Auftragsverarbeitung</h2>
        <ul className="list-disc list-inside ml-3">
          <li>
            <strong>Cloudflare R2</strong> (Speicherort EU): Speicherung der erzeugten PDF-Protokolle.
          </li>
          <li>
            <strong>FastBill GmbH</strong>: Erstellung von Rechnungen und Zahlungsabwicklung.
          </li>
          <li>
            <strong>Server-Hosting</strong>: Railway.com (Standort: EU) Betrieb der Docker-Container (Frontend, Backend, Datenbank).
          </li>
        </ul>
        <p>
          Mit allen externen Dienstleistern bestehen Auftragsverarbeitungsverträge
          bzw. sie handeln auf Basis EU-weiter Standardvertragsklauseln.
        </p>
      </section>

      <section className="space-y-3 mt-6">
        <h2 className="text-xl font-semibold">6. Speicherfristen</h2>
        <ul className="list-disc list-inside ml-3">
          <li>Kunden- und Schülerdaten: Löschung 1 Jahr nach Vertragsende.</li>
          <li>Sitzungsprotokolle & PDFs: Löschung 1 Jahr nach Rechnungsstellung bzw. Nachweiszweck.</li>
          <li>Server-Logs: Rotierender Zeitraum von max. 90 Tagen.</li>
        </ul>
        <p>Nach Ablauf der Fristen werden Daten automatisiert oder manuell gelöscht.</p>
      </section>

      <section className="space-y-3 mt-6">
        <h2 className="text-xl font-semibold">7. Sicherheitsmaßnahmen</h2>
        <ul className="list-disc list-inside ml-3">
          <li>Transportverschlüsselung (TLS) für alle externen Aufrufe.</li>
          <li>Passwörter werden mit bcrypt (Kostenfaktor 12) gespeichert.</li>
          <li>Ratenbegrenzung und CSRF-Schutz im Backend.</li>
          <li>Eingeschränkte Zugriffsrechte über rollenbasierten Login.</li>
        </ul>
      </section>

      <section className="space-y-3 mt-6">
        <h2 className="text-xl font-semibold">8. Betroffenenrechte</h2>
        <p>Ihnen stehen folgende Rechte zu:</p>
        <ul className="list-disc list-inside ml-3">
          <li>Auskunft (Art. 15 DSGVO) über gespeicherte Daten.</li>
          <li>Berichtigung (Art. 16 DSGVO) unrichtiger Daten.</li>
          <li>Löschung (Art. 17 DSGVO), sofern keine Aufbewahrungspflichten bestehen.</li>
          <li>Einschränkung der Verarbeitung (Art. 18 DSGVO).</li>
          <li>Datenübertragbarkeit (Art. 20 DSGVO).</li>
          <li>Widerruf von Einwilligungen (Art. 7 Abs. 3 DSGVO).</li>
          <li>Beschwerderecht bei einer Aufsichtsbehörde (Art. 77 DSGVO).</li>
        </ul>
      </section>

      <section className="space-y-3 mt-6">
        <h2 className="text-xl font-semibold">9. Kontakt für Datenschutzanfragen</h2>
        <p>
          Bitte richten Sie Datenschutzanfragen an die oben angegebenen
          Kontaktdaten oder per E-Mail an 
          <a className="text-blue-600 ml-1" href="mailto:[info@eisengarten.eu]">info@eisengarten.eu</a>.
        </p>
      </section>

      <section className="space-y-3 mt-6">
        <h2 className="text-xl font-semibold">10. Änderungen dieser Erklärung</h2>
        <p>
          Wir passen diese Datenschutzerklärung an, sobald neue Funktionen,
          Dienstleister oder rechtliche Anforderungen dies erforderlich machen.
          Die jeweils aktuelle Version ist direkt in der Anwendung abrufbar.
        </p>
      </section>

      <section className="space-y-3 mt-6">
        <h2 className="text-xl font-semibold">11. Einwilligungserklärung digitale Unterschrift</h2>
        <p className="italic">
          „Ich willige ein, dass meine digitale Unterschrift zusammen mit den
          angegebenen Sitzungsdaten gespeichert und zur Rechnungsstellung bzw.
          Leistungsdokumentation verwendet wird. Ich kann diese Einwilligung
          jederzeit mit Wirkung für die Zukunft widerrufen.“
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
