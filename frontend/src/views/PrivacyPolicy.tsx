import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Datenschutzerklärung</h1>

      <p className="text-sm text-gray-600 mb-6">Stand: März 2025</p>

      <p className="mb-4">
        Wir freuen uns über Ihr Interesse an unseren Dienstleistungen. Der Schutz
        Ihrer Daten ist uns wichtig. Im Folgenden informieren wir Sie über die
        Erhebung, Verarbeitung und Speicherung Ihrer personenbezogenen Daten
        gemäß der Datenschutz-Grundverordnung (DSGVO).
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Verantwortlicher</h2>
      <p className="mb-4">
        <strong>Verantwortlicher für die Datenverarbeitung:</strong><br />
        [Dein Name / Firmenname] <br />
        [Adresse] <br />
        [E-Mail-Adresse] <br />
        [Telefonnummer]
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Erhobene Daten und Zweck der Verarbeitung</h2>

      <p className="font-semibold">a) Kundendaten</p>
      <ul className="mb-4 list-disc list-inside">
        <li><strong>Daten:</strong> Name, E-Mail-Adresse, Telefonnummer.</li>
        <li><strong>Zweck:</strong> Kontaktaufnahme, Terminverwaltung und Rechnungsstellung.</li>
        <li><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).</li>
      </ul>

      <p className="font-semibold">b) Termindaten</p>
      <ul className="mb-4 list-disc list-inside">
        <li><strong>Daten:</strong> Datum, Uhrzeit, Thema des Termins, Name des Kunden.</li>
        <li><strong>Zweck:</strong> Dokumentation der erbrachten Leistungen.</li>
        <li><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).</li>
      </ul>

      <p className="font-semibold">c) Digitale Unterschriften</p>
      <ul className="mb-4 list-disc list-inside">
        <li><strong>Daten:</strong> Unterschrift als Bilddatei, verknüpft mit Termindaten.</li>
        <li><strong>Zweck:</strong> Nachweis der erbrachten Dienstleistung und Rechnungsstellung.</li>
        <li><strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).</li>
        <li><strong>Speicherort:</strong> Verschlüsselt auf Amazon S3 innerhalb der EU.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Speicherort und -dauer</h2>
      <ul className="mb-4 list-disc list-inside">
        <li><strong>Speicherort:</strong><br />
          Datenbank: AWS Lightsail (EU-Region).<br />
          Unterschriften: Amazon S3 (EU-Region).
        </li>
        <li><strong>Speicherdauer:</strong><br />
          Kundendaten: 3 Jahre nach Vertragsende.<br />
          Unterschriften: 2 Jahre nach Rechnungsstellung.<br />
          Löschung: Erfolgt automatisch nach Ablauf der Fristen.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Weitergabe der Daten</h2>
      <ul className="mb-4 list-disc list-inside">
        <li><strong>FastBill:</strong><br />
          Zweck: Automatisierte Rechnungsstellung.<br />
          Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).<br />
          Auftragsverarbeitungsvertrag (AVV): Besteht mit FastBill.
        </li>
        <li><strong>AWS:</strong><br />
          Zweck: Speicherung der Unterschriften und Termindaten.<br />
          AVV: Akzeptiert über die AWS Service Terms.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Sicherheit und Verschlüsselung</h2>
      <ul className="mb-4 list-disc list-inside">
        <li><strong>SSL-Verschlüsselung:</strong> Für alle Verbindungen zur Web-App.</li>
        <li><strong>Datenverschlüsselung:</strong><br />
          Serverseitig: AES-256 für Amazon S3.<br />
          Transportverschlüsselung: TLS/SSL für API und Datenbankzugriffe.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Ihre Rechte nach der DSGVO</h2>
      <ul className="mb-4 list-disc list-inside">
        <li><strong>Auskunftsrecht (Art. 15 DSGVO):</strong> Sie haben das Recht, Auskunft über die gespeicherten personenbezogenen Daten zu erhalten.</li>
        <li><strong>Recht auf Berichtigung (Art. 16 DSGVO):</strong> Sie können unrichtige oder unvollständige Daten korrigieren lassen.</li>
        <li><strong>Recht auf Löschung (Art. 17 DSGVO):</strong> Sie können die Löschung Ihrer Daten verlangen, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.</li>
        <li><strong>Recht auf Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie können die Übertragung Ihrer Daten an einen anderen Anbieter verlangen.</li>
        <li><strong>Widerrufsrecht (Art. 7 Abs. 3 DSGVO):</strong> Eine einmal erteilte Einwilligung zur Speicherung Ihrer Unterschrift können Sie jederzeit widerrufen.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Kontakt für Datenschutzanfragen</h2>
      <ul className="mb-4 list-disc list-inside">
        <li><strong>E-Mail:</strong> [deine-email@domain.com]</li>
        <li><strong>Adresse:</strong> [Deine Adresse]</li>
        <li><strong>Telefon:</strong> [Deine Telefonnummer]</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Änderungen der Datenschutzerklärung</h2>
      <p className="mb-4">
        Diese Datenschutzerklärung kann von Zeit zu Zeit aktualisiert werden, um rechtliche Anforderungen zu erfüllen. Die aktuelle Version finden Sie jederzeit auf unserer Website.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">9. Einwilligung zur digitalen Unterschrift</h2>
      <p className="mb-4 italic">
        „Ich stimme der digitalen Erfassung und Speicherung meiner Unterschrift gemäß der DSGVO zu. Ich wurde über mein Widerrufsrecht informiert.“
      </p>
    </div>
  );
};

export default PrivacyPolicy;