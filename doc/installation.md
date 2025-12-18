# Installation Guide - Ambrosia
## Installation (Docker)

for more details about the docker installation see [ambrosia-tutorial](https://olympus-btc.github.io/ambrosia-tutorial/)
```bash
docker-compose up -d --wait && docker-compose restart
```

## Installation (Native)

Before proceeding with the native installation, please ensure you have installed all the necessary [Project Dependencies](dependencies.md), such as Node.js, Gradle, and JDK 21.

```bash
wget -q https://raw.githubusercontent.com/olympus-btc/ambrosia/master/scripts/install.sh
chmod +x install.sh
./install.sh
```

The phoenixd installation script installs phoenixd automatically. The script downloads phoenixd v0.7.1, verifies the package integrity using GPG and checksums, installs it in `/usr/local/bin`, and optionally configures a systemd service for automatic startup.

Check [Mastering Phoenixd](https://btcgdl.github.io/Mastering-phoenixd/) for more details.

## Uninstallation 

To uninstall Ambrosia POS and phoenixd, run the following script:

```bash
curl -fsSL https://raw.githubusercontent.com/olympus-btc/ambrosia/master/scripts/uninstall.sh | bash
```

## Development Scripts

### Server (Backend - Kotlin/Gradle)

To run the server in development mode, go to the `server/` directory and run:

```sh
./gradlew run
```

### Client (Frontend - React/Electron)

Inside the `client/` directory, you can use the following scripts:

- **Install dependencies:**
  ```sh
  npm install
  ```

- **Start in development mode:**
  ```sh
  npm run dev
  ```

- **Build for production:**
  ```sh
  npm run build
  ```

- **Start in production mode (after building):**
  ```sh
  npm start
  ```