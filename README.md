##Prerrequisitos

* [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

##  Instrucciones de Instalación (Puesta en Marcha)

Esta guía es para levantar el proyecto desde cero en un nuevo entorno (ej. en clase).

**1. Clonar el Repositorio**
En tu terminal, clona el proyecto.
```bash
git clone [https://github.com/ikcdv23/LINGO-Javier-Alcate.git](https://github.com/ikcdv23/LINGO-Javier-Alcate.git)
cd LINGO-Javier-Alcate
```

**2. Levantar los Contenedores**
Este comando leerá el `docker-compose.yml` y construirá todos los contenedores (`web`, `db`, `phpmyadmin` y `node`). El contenedor `node` ejecutará automáticamente `npm install` y `npm run dev`.
```bash
docker-compose up -d --build
```
*(Espera a que termine. La primera vez puede tardar unos minutos en descargar las imágenes y construir el contenedor `web`).*

**3. Configurar el Entorno (`.env`)**
El archivo `.env` (con los secretos) no está en Git. Debemos crearlo a partir del ejemplo:
```bash
docker-compose exec web cp .env.example .env
```

**4. Instalar Dependencias de PHP (Composer)**
La carpeta `vendor/` tampoco está en Git. Este comando la crea instalando las librerías de PHP:
```bash
docker-compose exec web composer install
```

**5. Generar la Clave de la Aplicación**
El nuevo `.env` no tiene una clave de seguridad. Este comando la generará:
```bash
docker-compose exec web php artisan key:generate
```

**6. Ejecutar las Migraciones**
Ahora, crea toda la estructura de la base de datos (tablas `users`, `palabras`, `partidas`, etc.):
```bash
docker-compose exec web php artisan migrate
```

**7. Poblar el Diccionario (Paso Manual)**
La base de datos está vacía. Necesitamos importar las palabras.
1.  Abre phpMyAdmin en tu navegador: **`http://localhost:8080`**
2.  Inicia sesión:
    * **Servidor:** `db`
    * **Usuario:** `root`
    * **Contraseña:** `root_password_segura`
3.  Haz clic en la base de datos `laravel_db` (a la izquierda).
4.  Ve a la pestaña **"Importar"**.
5.  Selecciona el archivo `5_insertPalabras.sql` de tu proyecto y haz clic en "Importar".

---
Listo

* **Tu Juego:** `http://localhost`
* **Tu Base de Datos:** `http://localhost:8080`

(Recuerda que el servidor de Vite ya está corriendo gracias al contenedor `node`, así que no necesitas ejecutar `npm run dev` manualmente).
