#!/usr/bin/env node

/**
 * Merge Data Script
 *
 * Combines all monthly JSON files from /data/ into a single latest.json file.
 * This script should be run after adding a new monthly data file.
 *
 * Usage: node scripts/merge-data.js
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const outputFile = path.join(dataDir, 'latest.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
    console.error('Error: /data directory not found');
    process.exit(1);
}

// Find all JSON files matching YYYY-MM.json pattern (excluding latest.json)
const files = fs.readdirSync(dataDir)
    .filter(file => /^\d{4}-\d{2}\.json$/.test(file))
    .sort()
    .reverse(); // Sort in descending order (newest first)

if (files.length === 0) {
    console.error('Error: No monthly data files found in /data/');
    console.error('Expected files like: 2026-05.json, 2026-04.json, etc.');
    process.exit(1);
}

console.log(`Found ${files.length} data file(s):`);
files.forEach(f => console.log(`  - ${f}`));

// Merge all data
const mergedData = {
    metadata: {
        lastUpdated: new Date().toISOString(),
        monthsLoaded: []
    },
    clients: {},
    mergeHistory: []
};

let totalRecords = 0;

files.forEach(file => {
    const filePath = path.join(dataDir, file);
    const month = file.replace('.json', '');

    try {
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const fileData = JSON.parse(rawData);

        mergedData.metadata.monthsLoaded.push(month);

        // Merge clients from this month
        if (fileData.clients && typeof fileData.clients === 'object') {
            Object.entries(fileData.clients).forEach(([clientId, clientData]) => {
                if (!mergedData.clients[clientId]) {
                    mergedData.clients[clientId] = JSON.parse(JSON.stringify(clientData));
                    mergedData.clients[clientId].monthlyData = {};
                }

                // Merge monthly data
                if (clientData.monthlyData && typeof clientData.monthlyData === 'object') {
                    Object.assign(mergedData.clients[clientId].monthlyData, clientData.monthlyData);
                    totalRecords += Object.keys(clientData.monthlyData).length;
                }
            });
        }

        console.log(`✓ Merged ${file}`);
    } catch (error) {
        console.error(`✗ Error reading ${file}: ${error.message}`);
        process.exit(1);
    }
});

// Recalculate historical averages
Object.values(mergedData.clients).forEach(client => {
    if (client.monthlyData && typeof client.monthlyData === 'object') {
        const values = Object.values(client.monthlyData).filter(v => typeof v === 'number');
        if (values.length > 0) {
            client.historicalAvg = Math.round(
                (values.reduce((a, b) => a + b, 0) / values.length) * 100
            ) / 100;
        }
    }
});

// Write merged data
try {
    fs.writeFileSync(outputFile, JSON.stringify(mergedData, null, 2), 'utf-8');
    console.log(`\n✓ Successfully merged into latest.json`);
    console.log(`  - Total clients: ${Object.keys(mergedData.clients).length}`);
    console.log(`  - Total records: ${totalRecords}`);
    console.log(`  - Months covered: ${mergedData.metadata.monthsLoaded.length}`);
} catch (error) {
    console.error(`✗ Error writing latest.json: ${error.message}`);
    process.exit(1);
}
