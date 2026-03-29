# Bewerbungs-Engine

KI-gestütztes Bewerbungspaket für den deutschen Arbeitsmarkt. Generiert aus Stellenanzeigen professionelle Anschreiben und Lebensläufe.

## Installation

### Claude Desktop
1. Plugin-Manager öffnen
2. Nach "bewerbungs-engine" suchen
3. Installieren

### Claude Code CLI
```bash
/plugin install bewerbungs-engine
```

## Schnellstart

1. Öffne einen Ordner für deine Bewerbungen (z.B. `~/bewerbungen/`)
2. Fülle dein Profil aus: `/lebenslauf`
3. Generiere eine Bewerbung: `/bewerbung`

## Befehle

| Befehl | Beschreibung |
|--------|-------------|
| `/bewerbung` | Vollständige Bewerbung (Anschreiben + Lebenslauf) |
| `/lebenslauf` | Lebenslauf erstellen oder aktualisieren |
| `/anschreiben` | Nur Anschreiben generieren |

## Wie es funktioniert

1. Du füllst einmalig dein **Profil** aus (Berufserfahrung, Skills, Ausbildung)
2. Du fügst eine **Stellenanzeige** ein
3. Das Plugin **analysiert** die Anforderungen und **matcht** sie mit deinem Profil
4. Du erhältst ein **maßgeschneidertes Anschreiben** und einen **optimierten Lebenslauf**

## Ausgabe

Alle generierten Dokumente landen unter `output/{firma}_{rolle}/`:
- `anschreiben.md` — Fertiges Anschreiben (DIN 5008)
- `lebenslauf.md` — Angepasster Lebenslauf
- `analyse.md` — Matching-Analyse

## Lizenz

MIT
