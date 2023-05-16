const fs = require('fs');
const { parse } = require('csv-parse');
const { execSync } = require('child_process');
const spawn = require('cross-spawn');
const { performance } = require('perf_hooks');

let resultadoTempo = '';
function millisToMinutesAndSeconds(millis) {
  let minutes = Math.floor(millis / 60000);
  let seconds = ((millis % 60000) / 1000).toFixed(0);
  return (
    seconds == 60 ?
      (minutes + 1) + ":00" :
      minutes + ":" + (seconds < 10 ? "0" : "") + seconds
  );
}

let totalFaltasPorApp = {};
let faltasEncontradasPorApp = {};
let csvArray = [];
let csvData = {};
let firstFlag = true;
let header;
fs.createReadStream('csv input estudo empírico.csv')
  .pipe(parse({ delimiter: ',' }))
  .on('data', function (csvrow) {
    if (firstFlag) {
      firstFlag = false;
      header = csvrow;
    } else {
      let idx = 0;
      csvrow.forEach((csv) => {
        csvData[header[idx++]] = csv.includes('$$') ? csv.split('$$') : csv;
      });
      csvArray.push(csvData);
      csvData = {};
    }
  })
  .on('end', function () {
    executeStudy(csvArray);
    console.log(totalFaltasPorApp);
    console.log(resultadoTempo);
  });

const executeStudy = (csvArray) => {
  console.log(csvArray);

  const execute = (csv, n) => {
    const aplicacao = n === 1 ? '1_aplicacao' : '2_aplicacao';
    const aplicacaoUrl = n === 1 ? '1_aplicacao_url' : '2_aplicacao_url';

    //to execute one project for time.
    if (csv[aplicacao] !== 'website-learn-educational') return;

    [
      `${n}_falta_1`,
      `${n}_falta_2`,
      `${n}_falta_3`,
      `${n}_falta_4`,
      `${n}_falta_5`,
    ].forEach((falta) => {
      console.log(`### INSERINDO FALTA ${falta} NA APLICACAO ${csv[aplicacao]}`);
      console.log(csv[falta]);

      execSync(`cd workstation/${csv[aplicacao]} && git checkout -- .`);
      execSync(`cd workstation/${csv[aplicacao]} && git clean -f -d`);
      const filePath = `workstation/${csv[aplicacao]}/${csv[falta][0]}`;
      let file = fs.readFileSync(filePath).toString();
      fs.writeFileSync(filePath, file.replace(csv[falta][1], csv[falta][2]));

      if (csv[aplicacao].includes('spring')) {
        const port = csv[aplicacaoUrl].split(':')[2];
        execSync(`PORT=${port} DIR=${csv[aplicacao]} ./drop-port.sh`);
        execSync('sleep 20');
      } else {
        execSync('sleep 5');
      }

      const baseUrl = `BASE_URL="${csv[aplicacaoUrl]}"`;
      const baseUrlApi = `BASE_URL_API="${csv[aplicacaoUrl]}"`;
      execSync(`cd ../cytestion && sed -i '1c\\${baseUrl}' .env`);
      execSync(`cd ../cytestion && sed -i '2c\\${baseUrlApi}' .env`);

      let status = 0;
      const options = ['generate-test:dev'];
      const execCytestion = () => {
        const execution = spawn.sync('yarn', options, {
          stdio: 'inherit',
          cwd: '/home/thiagomoura/workspace/mestrado/gui-testing-exercise/cytestion/',
        });
        if (execution.status !== 0) status = execution.status;
      };

      const startTime = performance.now()
      execCytestion();
      const endTime = performance.now()
      resultadoTempo += millisToMinutesAndSeconds(endTime - startTime) + '(min:sec)\n'

      totalFaltasPorApp[csv[aplicacao]] ? totalFaltasPorApp[csv[aplicacao]] = totalFaltasPorApp[csv[aplicacao]] + 1 : totalFaltasPorApp[csv[aplicacao]] = 1;

      execSync(`cp -r ../e2e/exploratory cytestion/output/$(date +%F-%T)`);
      if (status !== 0) {
        faltasEncontradasPorApp[csv[aplicacao]] ? faltasEncontradasPorApp[csv[aplicacao]].push(`falta ${totalFaltasPorApp[csv[aplicacao]]}`) : faltasEncontradasPorApp[csv[aplicacao]] = [`falta ${totalFaltasPorApp[csv[aplicacao]]}`];
        console.log(faltasEncontradasPorApp);
      }
    });
  };

  csvArray.forEach((csv) => {
    execute(csv, 1);
    execute(csv, 2);
  });
};
