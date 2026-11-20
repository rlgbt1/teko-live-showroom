import {defineConfig} from '@playwright/test';
import {existsSync} from 'node:fs';
const macChrome='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
export default defineConfig({testDir:'./tests',fullyParallel:false,workers:1,use:{baseURL:process.env.PLAYWRIGHT_BASE_URL||'http://127.0.0.1:3000',headless:true,launchOptions:{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||(existsSync(macChrome)?macChrome:undefined)}},reporter:'list'});
