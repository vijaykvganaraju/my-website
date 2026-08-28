import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';

import app from '../app.js';

let server;
let baseUrl;

before(async () => {
    await new Promise((resolve) => {
        server = http.createServer(app);
        server.listen(0, () => {
            const address = server.address();
            baseUrl = `http://127.0.0.1:${address.port}`;
            resolve();
        });
    });
});

after(async () => {
    await new Promise((resolve, reject) => {
        server.close((err) => {
            if (err) {
                reject(err);
                return;
            }

            resolve();
        });
    });
});

test('renders the refreshed homepage', async () => {
    const response = await fetch(`${baseUrl}/`);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /Senior Software Engineer/);
    assert.doesNotMatch(body, /Computer Science student/);
});

test('renders the refreshed about page', async () => {
    const response = await fetch(`${baseUrl}/about`);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /21 fulfillment centers/);
    assert.match(body, /100K\+ events\/day/);
});

test('renders portfolio and resume pages', async () => {
    const portfolioResponse = await fetch(`${baseUrl}/portfolio`);
    const portfolioBody = await portfolioResponse.text();
    const resumeResponse = await fetch(`${baseUrl}/resume`);
    const resumeBody = await resumeResponse.text();

    assert.equal(portfolioResponse.status, 200);
    assert.match(portfolioBody, /CampusLore/);
    assert.equal(resumeResponse.status, 200);
    assert.match(resumeBody, /VIEW RAW DOCUMENT/);
    assert.doesNotMatch(resumeBody, /GET UNREDACTED VERSION/);
});

test('serves the published resume PDF', async () => {
    const response = await fetch(`${baseUrl}/assets/files/resume.pdf`);
    const body = await response.arrayBuffer();

    assert.equal(response.status, 200);
    assert.equal(response.headers.get('content-type'), 'application/pdf');
    assert.ok(body.byteLength > 100000);
});

test('serves the web app manifest', async () => {
    const response = await fetch(`${baseUrl}/manifest.webmanifest`);
    const manifest = await response.json();

    assert.equal(response.status, 200);
    assert.equal(manifest.short_name, 'Vijays Website');
});

test('does not expose EJS templates as static files', async () => {
    const response = await fetch(`${baseUrl}/about.ejs`);
    const body = await response.text();

    assert.equal(response.status, 404);
    assert.match(body, /Invalid URL/);
});

test('requires authentication before rendering blog authoring pages', async () => {
    const response = await fetch(`${baseUrl}/blog/new`);
    const body = await response.text();

    assert.equal(response.status, 401);
    assert.match(body, /Authentication required/);
});

test('renders contact page with a recaptcha site key', async () => {
    const response = await fetch(`${baseUrl}/contact`);
    const body = await response.text();

    assert.equal(response.status, 200);
    assert.match(body, /data-sitekey="/);
});
