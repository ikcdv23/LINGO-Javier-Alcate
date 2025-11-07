# LINGOverse (Reto 1 - DAW)

Este proyecto es una implementación del juego Lingo construido con Laravel 12 y Docker, siguiendo los requisitos del reto de 1ª Evaluación.

La rama `main` contiene la configuración inicial y la rama `dev` contiene la integración del juego y el sistema de ranking.

---

## 📋 Prerrequisitos

* [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

## ⚙️ Instrucciones de Puesta en Marcha (Desde Cero)

Esta guía es para levantar el proyecto completo (rama `dev`) en un nuevo entorno.

**1. Clonar el Repositorio**
```bash
git clone [https://github.com/ikcdv23/LINGO-Javier-Alcate.git](https://github.com/ikcdv23/LINGO-Javier-Alcate.git)
cd LINGO-Javier-Alcate
```

**2. Cambiar a la Rama de Desarrollo**
Todo el trabajo del juego está en la rama `dev`.
```bash
git checkout dev
```

**3. Levantar TODOS los Contenedores**
Este comando leerá el `docker-compose.yml` y levantará:
* `laravel-apache` (El servidor web PHP)
* `laravel-mysql` (La base de datos)
* `laravel-phpmyadmin` (El gestor de BBDD)
* `laravel-vite` (El servidor `npm run dev` automático)

```bash
docker-compose up -d --build
```
*(Espera ~1 minuto a que todos los contenedores arranquen. El contenedor `laravel-vite` ejecutará `npm install` y `npm run dev` por ti).*

**4. Configurar el Entorno (`.env`)**
Copia el archivo de ejemplo para crear tu archivo de secretos:
```bash
docker-compose exec web cp .env.example .env
```

**5. Instalar Dependencias de PHP (Composer)**
Instala todas las librerías de Laravel (la carpeta `vendor/`):
```bash
docker-compose exec web composer install
```

**6. Generar la Clave de la Aplicación**
El `.env` necesita una clave de seguridad única:
```bash
docker-compose exec web php artisan key:generate
```

**7. Ejecutar las Migraciones**
Crea todas las tablas en la base de datos (`users`, `palabras`, `partidas`, `password_resets`, etc.):
```bash
docker-compose exec web php artisan migrate
```

**8. Poblar el Diccionario (Paso Manual)**
La tabla `palabras` está vacía. Vamos a llenarla.
1.  Abre phpMyAdmin en tu navegador: **`http://localhost:8080`**
2.  Inicia sesión:
    * **Servidor:** `db`
    * **Usuario:** `root`
    * **Contraseña:** `root_password_segura`
3.  En la lista de la izquierda, haz clic en la base de datos `laravel_db`.
4.  Ve a la pestaña **"Importar"**.
5.  Haz clic en "Seleccionar archivo" y busca el archivo `5_insertPalabras.sql` en tu proyecto.
   -->  https://drive.google.com/file/d/1aZQ0MqHjQtcMKxlJyjVc7MALeLXiRZG3/view
7.  Baja y haz clic en **"Importar"**.

---

## 🎮 ¡Listo!

Ya está todo funcionando:

* **Aplicación Lingo:** `http://localhost`
* **Gestor de BBDD:** `http://localhost:8080`

(No necesitas ejecutar `npm run dev`, el contenedor `laravel-vite` ya lo está haciendo por ti).
