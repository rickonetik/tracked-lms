#!/usr/bin/env node

/**
 * ngrok-dev.js - Запуск ngrok для публичного доступа к WebApp и API
 */

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function isPortInUse(port) {
  return new Promise((resolve) => {
    exec(`lsof -Pi :${port} -sTCP:LISTEN -t`, (error) => {
      resolve(!error);
    });
  });
}

function getEnvVar(name, defaultValue) {
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    const envLines = envContent.split('\n');
    for (const line of envLines) {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match && match[1].trim() === name) {
        return match[2].trim();
      }
    }
  }
  return process.env[name] || defaultValue;
}

async function getNgrokUrl() {
  return new Promise((resolve, reject) => {
    const maxAttempts = 10;
    let attempts = 0;

    const checkNgrok = () => {
      attempts++;
      http.get('http://localhost:4040/api/tunnels', (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const tunnels = JSON.parse(data);
            const webappTunnel = tunnels.tunnels?.find(
              (t) => t.config?.addr?.includes(getEnvVar('WEBAPP_PORT', '5173'))
            );
            if (webappTunnel?.public_url) {
              resolve(webappTunnel.public_url);
            } else if (attempts < maxAttempts) {
              setTimeout(checkNgrok, 1000);
            } else {
              reject(new Error('Не удалось получить ngrok URL'));
            }
          } catch (error) {
            if (attempts < maxAttempts) {
              setTimeout(checkNgrok, 1000);
            } else {
              reject(error);
            }
          }
        });
      }).on('error', () => {
        if (attempts < maxAttempts) {
          setTimeout(checkNgrok, 1000);
        } else {
          reject(new Error('ngrok API недоступен'));
        }
      });
    };

    setTimeout(checkNgrok, 2000);
  });
}

async function main() {
  const webappPort = parseInt(getEnvVar('WEBAPP_PORT', '5173'), 10);

  return new Promise((resolve, reject) => {
    exec('which ngrok', (error) => {
      if (error) {
        log('⚠️  ngrok не установлен', 'yellow');
        log('Установите ngrok: brew install ngrok');
        process.exit(1);
      }

      isPortInUse(webappPort).then((webappRunning) => {
        if (!webappRunning) {
          log(`⚠️  WebApp не запущен на порту ${webappPort}`, 'yellow');
          process.exit(1);
        }

        log('🚀 Запуск ngrok для публичного доступа...', 'blue');
        log('📡 Запуск ngrok...', 'blue');

        const ngrok = spawn('ngrok', ['http', webappPort.toString()], {
          stdio: 'inherit',
        });

        setTimeout(async () => {
          try {
            const url = await getNgrokUrl();
            log('');
            log('✅ ngrok запущен!', 'green');
            log('');
            log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
            log('🌐 Публичный URL для WebApp:', 'green');
            log(`   ${url}`, 'blue');
            log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'blue');
            log('');

            process.on('SIGINT', () => {
              ngrok.kill();
              process.exit(0);
            });

            ngrok.on('exit', () => {
              process.exit(0);
            });
          } catch (error) {
            log(`⚠️  ${error.message}`, 'yellow');
            ngrok.kill();
            process.exit(1);
          }
        }, 3000);
      });
    });
  });
}

main().catch((error) => {
  log(`❌ Ошибка: ${error.message}`, 'yellow');
  process.exit(1);
});
