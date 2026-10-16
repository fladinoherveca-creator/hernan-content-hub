# I.E.D. Hernán Venegas Carrillo — Sitio web

Sitio web institucional con panel de administración para gestionar noticias, eventos, galería de fotos, técnicas SENA, directivos y textos de la página.

**Sitio en vivo:** https://hernan-content-hub.lovable.app

## Panel de administración

- Acceso: botón **Administrador** (arriba a la derecha en cualquier página).
- La primera cuenta registrada se convierte en la única administradora.
- Desde el panel se editan: textos, datos de contacto, noticias, eventos, fotos, técnicas SENA y directivos.

## Cómo funciona

- El contenido (noticias, fotos, textos) vive en una base de datos, no en el código: se edita desde el panel y se ve al instante en el sitio.
- El sitio necesita un servidor con Node.js y esa base de datos para funcionar; por eso GitHub solo guarda el **código**, no la página funcionando.

## Ver el código en GitHub

Este repositorio contiene el código fuente. Para ver el sitio funcionando, usa el enlace "Sitio en vivo" de arriba.

## Desarrollo

```sh
npm install
npm run dev
```

Este proyecto fue construido con [Lovable](https://lovable.dev). Cada cambio hecho en el editor de Lovable se sincroniza automáticamente con este repositorio.
