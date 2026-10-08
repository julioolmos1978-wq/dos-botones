# 🎮 Dos Botones

> **App interactiva de dos botones: cuando aprietas uno te dice si has acertado o no.**

Una experiencia web moderna, rápida y adictiva diseñada con estética Cyberpunk Glassmorphism, sintetizador de audio sin dependencias externas, efectos de confeti en Canvas, multiplicadores de racha y 3 modos de juego.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## ✨ Características Principales

- 🎯 **Mecánica Central Dinámica**: Elige entre dos botones en cada ronda con feedback inmediato visual y sonoro ("¡Acertaste!" o "¡Fallaste!").
- 🕹️ **3 Modos de Juego**:
  - **🎲 Clásico (Intuición)**: Desafía tu sexto sentido e intenta conseguir la racha más alta posible.
  - **⚡ Contrarreloj (Reflejos)**: Un temporizador dinámico que te obliga a decidir en milisegundos.
  - **🧠 Duelo de Saber (Trivia)**: Preguntas rápidas de 2 opciones con datos curiosos tras cada acierto.
- 🔊 **Audio Sintetizado en Tiempo Real**: Efectos sonoros generados dinámicamente mediante la **Web Audio API** (arpegio de victoria, fanfarria de récord, sonido de error y clics) sin necesidad de cargar archivos externos de audio. Incluye botón de silencio (*Mute*).
- 🎆 **Fuegos Artificiales y Confeti**: Motor de partículas sobre HTML5 Canvas que explotan desde el botón pulsado al acertar.
- 🔥 **Sistema de Rachas y Multiplicadores**: A medida que aciertas consecutivamente, se activa el modo en llamas con multiplicadores de puntuación (x1.0, x1.25, x1.5, x2.0...).
- 📊 **Panel de Estadísticas Persistente**: Guarda en `localStorage` tu récord de puntuación, mejor racha histórica, clics totales, porcentaje de precisión y tasa de victoria.
- 🌓 **Modo Oscuro / Modo Claro y Paletas de Colores**: Cambia el tema con un clic y personaliza la estética de los botones (Cian vs Rosa, Esmeralda vs Amatista, Fuego vs Hielo, Oro vs Obsidiana).
- ⌨️ **Soporte Completo de Teclado**:
  - Botón 1 (Izquierdo): Tecla `1`, `A` o `←` (Flecha izquierda).
  - Botón 2 (Derecho): Tecla `2`, `D` o `→` (Flecha derecha).

---

## 🚀 Cómo Ejecutar la Aplicación

No requiere instalación de Node.js ni dependencias pesadas:

1. Clona o descarga los archivos de este repositorio:
   - `index.html`
   - `style.css`
   - `app.js`
2. Haz doble clic sobre **`index.html`** para abrirlo directamente en cualquier navegador moderno (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Brave, etc.).

---

## 📁 Estructura del Proyecto

```text
dos-botones/
├── index.html       # Estructura semántica, accesibilidad y maquetación
├── style.css        # Sistema de diseño, Glassmorphism, temas y animaciones CSS
├── app.js           # Lógica del juego, sintetizador de sonido y motor de partículas
└── README.md        # Documentación del proyecto
```

---

## 📤 Cómo Subir Estos Archivos a tu Repositorio de GitHub

Si deseas subir esta versión completa a tu repositorio `https://github.com/julioolmos1978-wq/dos-botones`:

### Opción 1: Directamente desde la web de GitHub (Sin instalar Git)
1. Entra a tu repositorio: [https://github.com/julioolmos1978-wq/dos-botones](https://github.com/julioolmos1978-wq/dos-botones)
2. Haz clic en el botón **Add file** > **Upload files**.
3. Arrastra los archivos `index.html`, `style.css`, `app.js` y `README.md`.
4. En la parte inferior, escribe un mensaje de commit (por ejemplo: `feat: implementación completa del juego dos-botones`) y pulsa **Commit changes**.

### Opción 2: Usando Git en tu terminal
```bash
git clone https://github.com/julioolmos1978-wq/dos-botones.git
cd dos-botones
# Copia los archivos del proyecto aquí
git add .
git commit -m "feat: interfaz moderna y juego completo de dos botones"
git push origin main
```

---

## 🌐 Activar GitHub Pages (Juega online gratis)

Para que cualquiera pueda jugar a tu app directamente desde un enlace web:
1. Ve a tu repositorio en GitHub y haz clic en **Settings**.
2. En el menú lateral izquierdo, haz clic en **Pages**.
3. En **Branch**, selecciona `main` y la carpeta `/(root)`.
4. Haz clic en **Save**. En unos minutos tu juego estará publicado en vivo en:
   `https://julioolmos1978-wq.github.io/dos-botones/`

---

Desarrollado con ❤️ y JavaScript Vanilla.
