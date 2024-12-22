import chalk from 'chalk';
import { ucfirst } from './helpers/functions.js';
import fs from 'fs';
import unzipper from 'unzipper';

const args = process.argv.slice(2);

const importFileNames = {
  "eiland": "Eiland.jsx",
  "bioscoop": "Bioscoop.jsx",
  "huis": "Huis.jsx",
  "ziekenhuis": "Ziekenhuis.jsx",
}

const onError = (msg) => { console.error(`🚫 ${msg}`); process.exit(); }

console.clear();
console.log(`${args[0] ? chalk.hex("F5AA00").bold(`[${ucfirst(args[0])}] `) : ""}Import starten... ⏱️`);

// Clear the unzipped directory before extracting
await fs.rmSync('./import/unzipped', { recursive: true, force: true });

// read directory import to check for files
const files = fs.readdirSync("./import");
console.log(`📁 ${files.length} bestand${files.length === 1 ? "" : "en"} gevonden in de import map.`);
// console.log(`📄 ${chalk.hex("F5AA00").bold(`[${ucfirst(args[0])}] `)}${files.join(", ")}`);

// check if the import is just one file and is a zip file
if (files.length === 1 && files[0].includes(".zip")) {
  console.log(`✅ Uitpakken van: ${chalk.greenBright.bold(files[0])}...`);
} else {
  onError(`Er wordt ${chalk.redBright.bold("één")} zip bestand verwacht bij het importeren. ${chalk.redBright.bold("(pmndrs export)")}`);
}

// Create directories if they don't exist
if (!fs.existsSync('./import')) {
  fs.mkdirSync('./import', { recursive: true });
}
if (!fs.existsSync('./import/unzipped')) {
  fs.mkdirSync('./import/unzipped', { recursive: true });
}

// unzip the file
await fs.createReadStream(`./import/${files[0]}`)
  .pipe(unzipper.Extract({ path: './import/unzipped' }))
  .promise(); // Add promise() to properly wait for extraction

console.log(`✅ Uitpakken voltooid.`);

// read directory unzipped to check for files
// we expect 2 folders: "src" and "public" and 1 file: "package.json" in the root of the zip file
// if it is not there, we will throw an error
// const unzippedFiles = fs.readdirSync("./import/unzipped");
console.log("⏱️ Controleren of de uitgepakte bestanden correct zijn...");

// Check if the package.json file exists
if (fs.existsSync('./import/unzipped/package.json')) {
  console.log(`✅ ${chalk.greenBright.bold("package.json")} gevonden.`);
}else{
  onError(`Het ${chalk.redBright.bold("package.json")} bestand is niet gevonden.`);
}
// Check if the src and public directories exist
if(fs.existsSync('./import/unzipped/src')) {
  console.log(`✅ ${chalk.greenBright.bold("src")} map gevonden.`);
}else{
  onError(`De ${chalk.redBright.bold("src")} map is niet gevonden.`);
}
// check if there is a Model.js file in the src directory which is the model file for the project
if(fs.existsSync('./import/unzipped/src/Model.js')) {
  console.log(`✅ ${chalk.greenBright.bold("src/Model.js")} gevonden.`);
}else{
  onError(`Het ${chalk.redBright.bold("Model.js")} bestand is niet gevonden.`);
}
// Check if the public directory exists
if(fs.existsSync('./import/unzipped/public')) {
  console.log(`✅ ${chalk.greenBright.bold("public")} map gevonden.`);
}else{
  onError(`De ${chalk.redBright.bold("public")} map is niet gevonden.`);
}


console.log(`✅ Controle voltooid -> overschrijven van${chalk.hex("F5AA00").bold(` [${ucfirst(args[0])}]`)} bestanden gestart.`);

// copy all the files from the unzipped directory "public" to the project directory "public"
fs.readdirSync('./import/unzipped/public').forEach(file => {
  // make sure the file is overwritten
  fs.copyFileSync(`./import/unzipped/public/${file}`, `./public/${file}`, fs.constants.COPYFILE_FICLONE);
});

// copy the Model.js file and modify its content
const modelContent = fs.readFileSync('./import/unzipped/src/Model.js', 'utf8');
const componentName = importFileNames[args[0]].replace('.jsx', '');
const modifiedContent = modelContent.replace(
  'export function Model(props)',
  `export function ${componentName}(props)`
);

// Write the modified content to the destination file
fs.writeFileSync(
  `./src/components/canvas/${importFileNames[args[0]]}`,
  modifiedContent
);

console.log(`✅ Component hernoemd van ${chalk.hex("A5FF00").bold('Model.js')} naar ${chalk.hex("F5AA00").bold(componentName+ ".jsx")}`);

console.log(`✅ Importeren van ${chalk.hex("F5AA00").bold(`[${ucfirst(args[0])}]`)} voltooid.`);
// remove the unzipped directory and the zip file make sure the import directory is empty
fs.rmSync('./import/unzipped', { recursive: true, force: true });
// fs.rmSync(`./import/${files[0]}`, { force: true });