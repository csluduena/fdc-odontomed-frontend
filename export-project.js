import fs from 'fs';
import path from 'path';
import process from 'process';

// Patrones de archivos a omitir
const skipPatterns = [
    'package-lock.json',
    'README.md',
    'yarn.lock',
    /\.(jpg|jpeg|png|gif|ico|svg)$/i,
    /\.(mp3|mp4|wav|avi)$/i,
    /\.(pdf|doc|docx)$/i,
    /\.(ttf|woff|woff2|eot)$/i
];

function shouldSkipFile(filename) {
    // Primero verificamos el nombre del archivo
    const skipByName = skipPatterns.some(pattern => {
        if (typeof pattern === 'string') {
            return filename.toLowerCase() === pattern.toLowerCase();
        }
        return pattern.test(filename);
    });

    if (skipByName) return true;

    // Si es un archivo de dependencias, verificamos su contenido
    try {
        if (filename.endsWith('.json') || filename.endsWith('.lock')) {
            const content = fs.readFileSync(filename, 'utf-8');
            // Verificamos si el contenido tiene el patrón típico de dependencias
            if (content.includes('"@') && content.includes('resolved "https://registry.npmjs.org/')) {
                return true;
            }
        }
    } catch (error) {
        // Si hay error al leer el archivo, continuamos con el proceso normal
        console.error(`Error leyendo ${filename}: ${error.message}`);
    }

    return false;
}

function getProjectStructure(dir, indent = '') {
    let structure = '';
    const items = fs.readdirSync(dir);

    for (const item of items) {
        if (item === 'node_modules') continue;

        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            structure += `${indent}📁 ${item}\n`;
            structure += getProjectStructure(fullPath, indent + '  ');
        } else if (!shouldSkipFile(item)) {
            structure += `${indent}📄 ${item}\n`;
        }
    }

    return structure;
}

function exportProject() {
    const currentDir = process.cwd();
    const outputFile = 'proyecto_exportado.txt';
    let output = '';

    // Agregar los comandos necesarios para que el AI pueda ver el contenido
    output += `<relevant_files>\n`;
    output += getProjectStructure(currentDir).split('\n')
        .filter(line => line.includes('📄'))
        .map(line => line.trim().replace('📄 ', ''))
        .join('\n');
    output += `\n</relevant_files>\n\n\n`;

    // Escribir la estructura del proyecto
    output += "ESTRUCTURA DEL PROYECTO:\n";
    output += "=====================\n\n";
    output += getProjectStructure(currentDir);

    // Escribir el contenido de los archivos
    output += "\n\nCONTENIDO DE LOS ARCHIVOS:\n";
    output += "========================\n\n";

    function processDirectory(dir) {
        const items = fs.readdirSync(dir);

        for (const item of items) {
            if (item === 'node_modules') continue;

            const fullPath = path.join(dir, item);
            const stats = fs.statSync(fullPath);

            if (stats.isDirectory()) {
                processDirectory(fullPath);
            } else if (!shouldSkipFile(item)) {
                const relativePath = path.relative(currentDir, fullPath);
                try {
                    const content = fs.readFileSync(fullPath, 'utf-8');
                    output += `<open_file>\n${relativePath}\n\`\`\`${relativePath}\n${content}\n\`\`\`\n</open_file>\n\n`;
                } catch (error) {
                    output += `\n// Error leyendo ${relativePath}: ${error.message}\n`;
                }
            }
        }
    }

    processDirectory(currentDir);

    // Guardar todo en el archivo
    fs.writeFileSync(outputFile, output, 'utf-8');
    console.log('¡Exportación completada! Revisa el archivo "proyecto_exportado.txt"');
}

exportProject(); 