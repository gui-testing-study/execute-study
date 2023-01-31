const fs = require('fs');
const { parse } = require('csv-parse');
const { execSync } = require('child_process');
const spawn = require('cross-spawn');

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
  });

const executeStudy = (csvArray) => {
  console.log(csvArray);

  const execute = (csv, n) => {
    const aplicacao = n === 1 ? '1_aplicacao' : '2_aplicacao';
    const aplicacaoUrl = n === 1 ? '1_aplicacao_url' : '2_aplicacao_url';
    [
      `${n}_falta_1`,
      `${n}_falta_2`,
      `${n}_falta_3`,
      `${n}_falta_4`,
      `${n}_falta_5`,
    ].forEach((falta) => {
      console.log(`INSERINDO FALTA ${falta} NA APLICACAO ${aplicacao}`);
      execSync(`cd workstation/${csv[aplicacao]} && git checkout -- .`);
      const filePath = `workstation/${csv[aplicacao]}/${csv[falta][0]}`;
      let file = fs.readFileSync(filePath).toString();
      fs.writeFileSync(filePath, file.replace(csv[falta][1], csv[falta][2]));
      execSync('sleep 10');

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
      execCytestion();
    });
  };

  csvArray.forEach((csv) => {
    execute(csv, 1);
    execute(csv, 2);
  });
};
