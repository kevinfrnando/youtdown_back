# 🎵 YoutDown - Backend

Backend para descargar videos o audios de YouTube, construido con **Node.js + Express + TypeScript** siguiendo principios de **Clean Architecture**.

---

## 📑 Tabla de contenidos

1. [🚀 Requisitos previos](#-requisitos-previos)
2. [📥 Instalación](#-instalación)
3. [▶️ Ejecución en modo desarrollo](#️-ejecución-en-modo-desarrollo)
4. [📡 Endpoints](#-endpoints)
   - [1️⃣ POST /api/download](#1️⃣-post-apidownload)
   - [2️⃣ GET /api/filefilename](#2️⃣-get-apifilefilename)
5. [🧪 Pruebas con Postman](#-pruebas-con-postman)
6. [🛠️ Scripts disponibles](#️-scripts-disponibles)
7. [📂 Estructura del proyecto](#-estructura-del-proyecto)
8. [📌 Notas importantes](#-notas-importantes)
9. [📄 Licencia](#-licencia)

---

## 🚀 Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) >= 18
- [npm](https://www.npmjs.com/) o [yarn](https://yarnpkg.com/)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) (herramienta para descargar videos)
- [ffmpeg](https://ffmpeg.org/download.html) (para convertir audios/videos)

Verifica que estén instalados con:

```bash
node -v
npm -v
yt-dlp --version
ffmpeg -version
```

---

## 📥 Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/youtdown_back.git
cd youtdown_back
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Crear la carpeta temporal para descargas**

```bash
mkdir -p tmp/yt
```

---

## ▶️ Ejecución en modo desarrollo

```bash
npm run dev
```

El servidor estará disponible en:

```
http://localhost:3000
```

---

## 📡 Endpoints

### 1️⃣ `POST /api/download`

Descarga un video o audio de YouTube.

#### Request Body (JSON)

```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "format": "mp3"
}
```

- `url` → enlace de YouTube (obligatorio)
- `format` → `"mp3"` o `"mp4"`

#### Respuesta

```json
{
  "filePath": "tmp/yt/9f9be75e-4945-43c2-859b-39111db318d5-video.mp3"
}
```

El archivo se guarda en la carpeta `tmp/yt`.

---

### 2️⃣ `GET /api/file/:filename`

Descarga el archivo directamente desde el servidor.

#### Ejemplo

```
GET http://localhost:3000/api/file/9f9be75e-4945-43c2-859b-39111db318d5-video.mp3
```

El navegador o Postman descargará el archivo automáticamente.

---

## 🧪 Pruebas con Postman

1. Abre **Postman**
2. Crea una petición `POST` a:

   ```
   http://localhost:3000/api/download
   ```

3. En el **Body** → selecciona **raw → JSON**
4. Envía el siguiente payload:

```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "format": "mp3"
}
```

5. Copia el `filePath` que devuelve la respuesta.
6. Haz un `GET` a:

```
http://localhost:3000/api/file/<NOMBRE_DEL_ARCHIVO>
```

Ejemplo:

```
http://localhost:3000/api/file/9f9be75e-4945-43c2-859b-39111db318d5-video.mp3
```

Esto descargará el archivo.

---

## 🛠️ Scripts disponibles

- `npm run dev` → Modo desarrollo con **ts-node-dev**
- `npm run build` → Compila TypeScript a JavaScript en `/dist`
- `npm start` → Ejecuta la versión compilada

---

## 📂 Estructura del proyecto

```
youtdown_back/
├── src/
│   ├── application/    # Casos de uso
│   ├── domain/         # Entidades
│   ├── infrastructure/ # Servicios (yt-dlp, ffmpeg, etc.)
│   ├── interfaces/     # Controladores y rutas
│   └── index.ts        # Punto de entrada
├── tmp/yt/             # Carpeta temporal para descargas
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📌 Notas importantes

- Este backend descarga archivos en la carpeta `tmp/yt`.
- Para producción, considera limpiar periódicamente la carpeta.

---

## 📄 Licencia

MIT
