---
tags:
  - Markdown
state:
  - "10"
type:
  - Tutorial
publish:
  - public
---

# Markdown Showcase & Tutorial (AI generiert)

Diese Seite zeigt alle verfügbaren Markdown-Features. Zuerst der Code, dann das Ergebnis.

---

## Überschriften

```
# Überschrift 1
## Überschrift 2
### Überschrift 3
#### Überschrift 4
##### Überschrift 5
###### Überschrift 6
```

### Überschrift 3
#### Überschrift 4
##### Überschrift 5
###### Überschrift 6

---

## Text-Formatierung

```
**fetter Text**
*kursiver Text*
***fett und kursiv***
~~durchgestrichen~~
`inline code`
```

**fetter Text**
*kursiver Text*
***fett und kursiv***
~~durchgestrichen~~
`inline code`

---

## Links

```
[Google](https://google.com)
[Mit Hover-Titel](https://google.com "Das sieht man beim Hovern")
```

[Google](https://google.com)
[Mit Hover-Titel](https://google.com "Das sieht man beim Hovern")

---

## Wikilinks (Plugin)

```
[[geschichte]]
[[geschichte|Zur Geschichte]]
[[geschichte|**Fetter** Link-Text]]
```

[[A random story for testing]]
[[A random story for testing|Zur Geschichte]]
[[A random story for testing|**Fetter** Link-Text]]

---

## Bilder

### Standard Markdown

```
![Alt-Text](/images/CrossDocu_Grafik.png)
```

![Alt-Text](/images/CrossDocu_Grafik.png)

### Wikilink Bild-Embeds

```
![[CrossDocu_Grafik.png]]
![[CrossDocu_Grafik.png|Alt-Text hier]]
![[CrossDocu_Grafik.png|200x100]]
![[CrossDocu_Grafik.png|Logo mit Größe|200x100]]
```

![[CrossDocu_Grafik.png|Logo mit Größe|200x100]]

---

## Ungeordnete Listen

```
- Erster Punkt
- Zweiter Punkt
  - Unterpunkt A
  - Unterpunkt B
    - Noch tiefer
- Dritter Punkt
```

- Erster Punkt
- Zweiter Punkt
  - Unterpunkt A
  - Unterpunkt B
    - Noch tiefer
- Dritter Punkt

---

## Geordnete Listen

```
1. Schritt eins
2. Schritt zwei
3. Schritt drei
   1. Unter-Schritt 3.1
   2. Unter-Schritt 3.2
4. Schritt vier
```

1. Schritt eins
2. Schritt zwei
3. Schritt drei
   1. Unter-Schritt 3.1
   2. Unter-Schritt 3.2
4. Schritt vier

---

## Gemischte Listen

```
1. Erster Schritt
   - Detail A
   - Detail B
2. Zweiter Schritt
   - Detail C
```

1. Erster Schritt
   - Detail A
   - Detail B
2. Zweiter Schritt
   - Detail C

---

## Blockquotes (Zitate)

### Einfach

```
> Das ist ein Zitat.
```

> Das ist ein Zitat.

### Mehrzeilig

```
> Erste Zeile des Zitats.
> Zweite Zeile.
>
> Neuer Absatz im Zitat.
```

> Erste Zeile des Zitats.
> Zweite Zeile.
>
> Neuer Absatz im Zitat.

### Verschachtelt

```
> Äußeres Zitat
> > Inneres Zitat
> > > Noch tiefer
```

> Äußeres Zitat
> > Inneres Zitat
> > > Noch tiefer

---

## Code

### Inline

```
Nutze `console.log()` zum Debuggen.
```

Nutze `console.log()` zum Debuggen.

### Code-Block mit Syntax-Highlighting

Eingerahmt mit drei Backticks und dem Sprachnamen dahinter:

````
```javascript
function hallo(name) {
    return `Hallo, ${name}!`;
}
```
````

```javascript
function hallo(name) {
    return `Hallo, ${name}!`;
}
```

### Weitere Sprachen

```html
<div class="container">
    <h1>Hallo Welt</h1>
    <p>Ein <strong>fetter</strong> Paragraph.</p>
</div>
```

```css
body {
    font-family: 'Inter', sans-serif;
    background: #1a1a2e;
    color: #e0e0e0;
}
```

```json
{
    "name": "CrossDocu",
    "version": "1.0.0",
    "active": true
}
```

---

## Tabellen

```
| Spalte 1 | Spalte 2 | Spalte 3 |
|----------|----------|----------|
| Zelle A  | Zelle B  | Zelle C  |
| Zelle D  | Zelle E  | Zelle F  |
```

| Spalte 1 | Spalte 2 | Spalte 3 |
|----------|----------|----------|
| Zelle A  | Zelle B  | Zelle C  |
| Zelle D  | Zelle E  | Zelle F  |

### Ausrichtung

```
| Links      | Zentriert | Rechts   |
|:-----------|:---------:|---------:|
| Text       | Text      | 42       |
| Mehr Text  | Mitte     | 1.234€   |
```

`:---` = links, `:---:` = zentriert, `---:` = rechts

| Links      | Zentriert | Rechts   |
|:-----------|:---------:|---------:|
| Text       | Text      | 42       |
| Mehr Text  | Mitte     | 1.234€   |

---

## Horizontale Linie

```
---
***
___
```

Alle drei erzeugen dasselbe:

---

## Inline HTML

```html
<details>
<summary>Aufklappen</summary>
Versteckter Inhalt mit **Markdown**!
</details>
```

<details>
<summary>Aufklappen für versteckten Inhalt</summary>

Hier ist der versteckte Text! Man kann auch **Markdown** darin nutzen.

- Punkt 1
- Punkt 2

</details>

---

## Escaping

Ein `\` vor dem Zeichen verhindert die Markdown-Interpretation:

```
\*nicht kursiv\*
\# keine Überschrift
\[kein Link\](nein)
\[\[kein Wikilink\]\]
```

\*nicht kursiv\*
\# keine Überschrift
\[kein Link\](nein)
\[\[kein Wikilink\]\]

---

## Zeilenumbrüche

```
Absatz 1 (Leerzeile danach = neuer Absatz)

Absatz 2

Zeile mit zwei Leerzeichen am Ende··
erzwingt einen Umbruch ohne neuen Absatz.
```

Absatz 1 (Leerzeile danach = neuer Absatz)

Absatz 2

Zeile mit zwei Leerzeichen am Ende  
erzwingt einen Umbruch ohne neuen Absatz.

---

## Emojis

```
Direkt einfügen: 🎉 🚀 ✅ ❌ 💡 ⚠️ 📝
```

Direkt einfügen: 🎉 🚀 ✅ ❌ 💡 ⚠️ 📝

---

## Kombinationen

```
> **Tipp:** Nutze *Kombinationen* für mehr Ausdruck:
>
> - **Fetter** Text in Listen
> - `Code` in Listen
> - [[geschichte|Wikilinks in Listen]]
```

> **Tipp:** Nutze *Kombinationen* für mehr Ausdruck:
>
> - **Fetter** Text in Listen
> - `Code` in Listen
> - [[A random story for testing|Wikilinks in Listen]]

---

*Ende des Tutorials* ✨
