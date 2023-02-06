const fs = require('fs');
const { parse } = require('csv-parse');
const { execSync } = require('child_process');
const spawn = require('cross-spawn');

let artefatosAntigosTESTAR = [];
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
  });

const executeStudy = (csvArray) => {
  console.log(csvArray);

  const execute = (csv, n) => {
    const aplicacao = n === 1 ? '1_aplicacao' : '2_aplicacao';
    const aplicacaoUrl = n === 1 ? '1_aplicacao_url' : '2_aplicacao_url';
    // if (csv[aplicacao] === 'spring-shop-n3xt') return;

    [
      `${n}_falta_1`,
      `${n}_falta_2`,
      `${n}_falta_3`,
      `${n}_falta_4`,
      `${n}_falta_5`,
    ].forEach((falta) => {
      console.log(`### INSERINDO FALTA ${falta} NA APLICACAO ${aplicacao}`);
      execSync(`cd workstation/${csv[aplicacao]} && git checkout -- .`);
      const filePath = `workstation/${csv[aplicacao]}/${csv[falta][0]}`;
      let file = fs.readFileSync(filePath).toString();
      fs.writeFileSync(filePath, file.replace(csv[falta][1], csv[falta][2]));

      if (csv[aplicacao].includes('spring')) {
        const port = csv[aplicacaoUrl].split(':')[2];
        execSync(`PORT=${port} DIR=${csv[aplicacao]} ./drop-port.sh`);
        execSync('sleep 15');
      } else {
        execSync('sleep 5');
      }

      // const baseUrl = `BASE_URL="${csv[aplicacaoUrl]}"`;
      // const baseUrlApi = `BASE_URL_API="${csv[aplicacaoUrl]}"`;
      // execSync(`cd ../cytestion && sed -i '1c\\${baseUrl}' .env`);
      // execSync(`cd ../cytestion && sed -i '2c\\${baseUrlApi}' .env`);

      const SUTConnectorValue = `SUTConnectorValue = "/usr/bin/chromedriver" "1920x900+0+0" "${csv[aplicacaoUrl]}"`;
      const DomainsAllowed = `DomainsAllowed = ${csv[aplicacaoUrl]}`;
      execSync(`cd testar/settings/webdriver_generic && sed -i '1c\\${SUTConnectorValue}' test.settings`);
      execSync(`cd testar/settings/webdriver_generic && sed -i '2c\\${DomainsAllowed}' test.settings`);

      let status = 0;
      const options = ['generate-test:dev'];
      const execCytestion = () => {
        const execution = spawn.sync('yarn', options, {
          stdio: 'inherit',
          cwd: '/home/thiagomoura/workspace/mestrado/gui-testing-exercise/cytestion/',
        });
        if (execution.status !== 0) status = execution.status;
      };
      if (!totalFaltasPorApp[csv[aplicacao]]) {
        console.time('Time execution');
        execSync(`docker run --net=host --shm-size=512m --mount type=bind,source="/home/thiagomoura/workspace/mestrado/gui-testing-exercise/execute-study/testar/settings",target=/testar/bin/settings --mount type=bind,source="/home/thiagomoura/workspace/mestrado/gui-testing-exercise/TESTAR_dev",target=/mnt --mount type=bind,source="/home/thiagomoura/workspace/mestrado/gui-testing-exercise/execute-study/testar/output",target=/testar/bin/output aslomp/testar:latest`);
        console.timeEnd('Time execution');
        // execCytestion();
        const artefatosTESTAR = fs.readdirSync('testar/output').filter((file) => file !== '.gitignore');
        let novoDiretorio;
        artefatosTESTAR.forEach(arte => {
          if (!artefatosAntigosTESTAR.includes(arte)) novoDiretorio = arte;
        });
        artefatosAntigosTESTAR = artefatosTESTAR;
        const fileReport = fs.readdirSync(`testar/output/${novoDiretorio}/HTMLreports`)[0];
        const reportHTML = fs.readFileSync(`testar/output/${novoDiretorio}/HTMLreports/${fileReport}`).toString();
        if (!reportHTML.includes('No problem detected')) {
          faltasEncontradasPorApp[csv[aplicacao]] ? faltasEncontradasPorApp[csv[aplicacao]].push(falta) : faltasEncontradasPorApp[csv[aplicacao]] = [falta];
          console.log(faltasEncontradasPorApp);
        }
        totalFaltasPorApp[csv[aplicacao]] ? totalFaltasPorApp[csv[aplicacao]] = totalFaltasPorApp[csv[aplicacao]] + 1 : totalFaltasPorApp[csv[aplicacao]] = 1;
      }
    });
  };

  csvArray.forEach((csv) => {
    execute(csv, 1);
    execute(csv, 2);
  });
};
