# ⏱️ TIMECALC - Calculadora de Desfases

**Una Progressive Web App (PWA) diseñada para calcular con precisión el desfase de tiempo entre un reloj (como el de un DVR) y la hora oficial, y aplicar esa diferencia para encontrar la hora correcta en futuras búsquedas.**

---

## 🚀 Características

- ✅ **Cálculo de Desfase Inicial**: Determina la diferencia exacta (adelanto o retraso) entre dos fechas y horas.
- ✅ **Cálculo Bidireccional**:
  - Calcula la hora que se debe buscar en el DVR a partir de una hora oficial.
  - Calcula la hora oficial real a partir de una hora registrada en el DVR.
- 🌗 **Tema Claro y Oscuro**: Incluye un interruptor para cambiar de tema, guardando la preferencia del usuario.
- 📱 **Instalable (PWA)**: Se puede instalar en dispositivos móviles y de escritorio para un acceso rápido.
- ⚡ **Funciona Offline**: Gracias al Service Worker, la aplicación es totalmente funcional sin conexión a internet.
- 🎯 **Diseño Moderno**: Interfaz limpia y responsiva construida con Bootstrap 5.

---

## 🧩 ¿Cómo instalar?

1. Abre [TIMECALC](https://ismaelefc.github.io/TIMECALC/) en un navegador compatible (Chrome, Edge, Safari).
2. **En móvil**: Toca el menú de tres puntos (⋮) y selecciona **“Instalar aplicación”** o **"Añadir a pantalla de inicio"**.
3. **En escritorio**: Busca el icono de instalación en la barra de direcciones (normalmente un monitor con una flecha hacia abajo) y haz clic en **"Instalar"**.
4. ¡Listo! La app estará en tu pantalla principal o en tu lista de aplicaciones.

---

## 📦 Tecnologías utilizadas

- HTML, CSS y JavaScript
- PWA (Manifest + Service Worker)
- **Bootstrap 5** para el diseño y los componentes.
- **jQuery & jQuery UI** para la selección de fechas (Datepicker).
- **Moment.js** para el manejo de fechas y horas.
- **GitHub Pages** para el despliegue.

---

## 📁 Archivos clave

| Archivo         | Propósito                                   |
|-----------------|---------------------------------------------|
| `manifest.json` | Define la experiencia de instalación PWA    |
| `sw.js`         | Permite funcionalidades offline             |
| `icon-192.png`  | Ícono para Android (pantalla principal)     |
| `icon-512.png`  | Ícono de alta resolución para el sistema    |

---

## 🧠 Autor

**Ismael EFC**  

---

## 📌 Contribuciones

¡Se aceptan ideas, mejoras y sugerencias! Abre un issue o haz un fork.

---

## 🔒 Licencia

Este proyecto se distribuye como OPENSOURCE.
