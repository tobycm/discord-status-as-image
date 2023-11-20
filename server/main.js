import express from 'express';
import fetch from 'node-fetch';
import puppeteer from 'puppeteer-core';

const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Hello from server!' });
});

app.get('/smallcard/:id', async (req, res) => {
  try {
    const { id } = req.params;

    fetch(`http://127.0.0.1:7000/user/${id}`)
      .then((response) => {
        try {
          if (response.status == 404) {
            res.status(404).send('User not found');
            return null;
          }
          return response.json();
        } catch {
          res.status(500).send('Internal Server Error');
          return null;
        }
      })
      .then(async (data) => {
        try {
          const browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium-browser',
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--headless', '--disable-gpu'],
          });
          const page = await browser.newPage();
          await page.goto(
            `http://localhost:2011/smallcard?username=${data['username']}&avatar=${data['avatar_url']}&status=${data['status']}`,
            { waitUntil: ['domcontentloaded', 'load', 'networkidle2'] }
          );
          await page.waitForTimeout(100);
          const screenshotBuffer = await page.screenshot({
            clip: { x: 0, y: 0, width: 1350, height: 450 },
          });
          await browser.close();
          res.set('Content-Type', 'image/png');
          res.send(screenshotBuffer);
        } catch {
          res.status(500).send('Internal Server Error');
        }
      });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(1911, () => console.log('Server is running on http://localhost:1911'));
