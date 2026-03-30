# Test-Stellenanzeigen

Fünf realistische Stellenanzeigen aus verschiedenen Branchen zum Testen des Matching-Algorithmus.

---

## Test 1: IT / Tech — Starkes Matching

### Senior Python Developer (m/w/d) — FinTech Solutions GmbH, Berlin

**Referenznummer:** FTS-2026-042
**Ansprechpartnerin:** Frau Dr. Lisa Weber

Für unser wachsendes Engineering-Team suchen wir eine/n erfahrene/n Python-Entwickler/in.

**Deine Aufgaben:**
- Entwicklung und Optimierung unserer Microservice-Architektur (Python, FastAPI)
- Design und Implementierung von RESTful APIs
- Aufbau und Pflege von CI/CD-Pipelines
- Performance-Optimierung bestehender Services
- Code Reviews und Mentoring von Junior-Entwicklern

**Dein Profil:**
- Mind. 4 Jahre Erfahrung mit Python
- Erfahrung mit FastAPI oder Django
- Kenntnisse in Docker und Kubernetes
- Erfahrung mit relationalen Datenbanken (PostgreSQL bevorzugt)
- AWS-Erfahrung von Vorteil
- Teamfähigkeit und eigenverantwortliches Arbeiten

**Erwartetes Matching:** stark (>80% Must-Have-Abdeckung)

---

## Test 2: Finanzen — Teilweises Matching

### IT-Projektmanager (m/w/d) Digitalisierung — Sparkasse Berlin

**Referenznummer:** SPK-B-1123

Die Sparkasse Berlin sucht zum nächstmöglichen Zeitpunkt eine/n IT-Projektmanager/in für die Abteilung Digitale Transformation.

**Ihre Aufgaben:**
- Leitung von IT-Projekten im Rahmen der Digitalisierungsstrategie
- Koordination zwischen Fachbereichen und externen Dienstleistern
- Einführung agiler Methoden in der IT-Organisation
- Budget- und Ressourcenplanung
- Erstellung von Entscheidungsvorlagen für die Geschäftsleitung

**Ihr Profil:**
- Abgeschlossenes Studium der (Wirtschafts-)Informatik oder vergleichbar
- Mind. 5 Jahre Erfahrung im IT-Projektmanagement
- Zertifizierung in Projektmanagement (PMP, PRINCE2 oder Scrum Master)
- Kenntnisse regulatorischer Anforderungen im Bankensektor (MaRisk, BAIT)
- Erfahrung mit Jira, Confluence und SAP von Vorteil
- Sehr gute Deutschkenntnisse in Wort und Schrift

**Erwartetes Matching:** mittel (technische Basis vorhanden, PM-Erfahrung und Bankenwissen fehlen)

---

## Test 3: Öffentlicher Dienst — Schwaches Matching

### Sachbearbeiter/in IT-Koordination (m/w/d) — Bundesamt für Sicherheit in der Informationstechnik (BSI)

**Entgeltgruppe:** E 11 TVöD Bund
**Dienstort:** Bonn
**Kennziffer:** BSI-2026-0189

**Aufgaben:**
- Koordination der IT-Beschaffung gemäß Vergaberecht (UVgO, VgV)
- Erstellung von Leistungsbeschreibungen für IT-Ausschreibungen
- Verwaltung von IT-Verträgen und Service Level Agreements
- Abstimmung mit dem Beschaffungsamt des BMI

**Anforderungen:**
- Laufbahnbefähigung für den gehobenen nichttechnischen Verwaltungsdienst ODER abgeschlossenes Hochschulstudium (Bachelor)
- Kenntnisse im Vergaberecht
- Erfahrung in der öffentlichen Verwaltung
- SAP-Kenntnisse (Modul MM) erwünscht
- Deutsche Staatsangehörigkeit oder EU/EWR (Sicherheitsüberprüfung erforderlich)

**Erwartetes Matching:** schwach (Studium passt, aber Verwaltungserfahrung und Vergaberecht fehlen)

---

## Test 4: Startup / Modern — Starkes Matching

### Platform Engineer (all genders) — GreenMobility, Berlin

Hey! Wir sind GreenMobility und bauen die Mobilitätsplattform der Zukunft. Unser Stack: Go, Kubernetes, AWS, Terraform.

**Was du bei uns machst:**
- Du baust und betreibst unsere Cloud-Infrastruktur (AWS, Terraform)
- Du entwickelst interne Developer-Tools und CI/CD-Pipelines
- Du optimierst unsere Kubernetes-Cluster für Performance und Kosten
- Du arbeitest eng mit unseren Product-Teams zusammen

**Was du mitbringst:**
- Starke Erfahrung mit Kubernetes und Docker
- Infrastructure-as-Code (Terraform, Pulumi o.ä.)
- Erfahrung mit AWS (EC2, EKS, S3, Lambda)
- Programmierkenntnisse in Go oder Python
- CKA-Zertifizierung ist ein Plus
- Du liebst Automatisierung und hasst manuelle Prozesse

**Was wir bieten:**
- Remote-first, 4-Tage-Woche
- Budget für Weiterbildung
- Cooles Team, flache Hierarchien

**Erwartetes Matching:** stark (Go, K8s, AWS, Terraform, CKA — fast alles vorhanden)

---

## Test 5: Gesundheit / Pharma — Kein Matching

### Regulatory Affairs Manager (m/w/d) — PharmaCare AG, Frankfurt

**Ihre Aufgaben:**
- Erstellung und Einreichung von Zulassungsanträgen bei EMA und BfArM
- Betreuung des gesamten Lifecycle-Managements zugelassener Arzneimittel
- Kommunikation mit Behörden und Ethikkommissionen
- Sicherstellung der GxP-Compliance

**Ihr Profil:**
- Abgeschlossenes Studium der Pharmazie, Biologie oder Chemie
- Mind. 3 Jahre Erfahrung im Bereich Regulatory Affairs
- Fundierte Kenntnisse des EU-Arzneimittelrechts
- Erfahrung mit eCTD-Einreichungen
- Verhandlungssicheres Englisch

**Erwartetes Matching:** kein Match (völlig andere Branche und Qualifikation — Plugin sollte warnen)

---

## Validierungskriterien

Für jede Stellenanzeige prüfen:

1. [ ] Stellenanzeige wird korrekt geparst (Firma, Rolle, Anforderungen)
2. [ ] Matching-Tabelle wird erstellt mit korrekten Stärken
3. [ ] Branche wird erkannt und richtiges Template gewählt
4. [ ] Ton passt zur Branche (formal vs. modern)
5. [ ] Bei schwachem Match: Warnung wird ausgegeben
6. [ ] Anschreiben enthält nur belegbare Argumente aus dem Profil
7. [ ] DIN 5008 Format wird eingehalten
8. [ ] Keine erfundenen Qualifikationen
9. [ ] Lebenslauf priorisiert relevante Erfahrungen
10. [ ] Output-Struktur stimmt (3 Dateien im richtigen Ordner)
