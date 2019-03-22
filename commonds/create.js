const validateProjectName = require('validate-npm-package-name');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const cwd = process.cwd();
const inquirer = require('inquirer');
function checkAppName(appName) {
  let appPath = path.join(cwd, appName);
  let { validForNewPackages, warnings } = validateProjectName(
    path.parse(appName).base
  );
  if (!validForNewPackages) {
    console.log(chalk.red('Error: 项目名称不能包含大写字母'));
    process.exit(1);
  }
  return appPath;
}
const askTemplate = () => {
  const q = [];
  const list = [
    {
      name: '原生小程序',
      value: 'miniNative',
    },
  ];
  q.push({
    type: 'list',
    name: 'appTplName',
    message: '请选择框架',
    choices: list,
  });
  return inquirer.prompt(q);
};
const askWenaox = () => {
  return inquirer.prompt([
    {
      type: 'confirm',
      name: 'isWenaox',
      message: '是否需要wenaox',
    },
  ]);
};
function copyTemplate(data) {
  let { appTplName, appPath, ...props } = data;
  let tplSrc = path.join(__dirname, '..', 'templates', appTplName);
  let appName = path.basename(appPath);
  if (fs.existsSync(appPath)) {
    console.log(chalk.red(`目录 ${appName} 已存在\n`));
    process.exit(1);
  }
  fs.ensureDirSync(appPath);
  fs.copySync(tplSrc, appPath);
  writePackageJson({ ...props, appPath, appName });
  console.log(
    `\n项目 ${chalk.green(appName)} 创建成功, 路径: ${chalk.green(appPath)}\n`
  );
  console.log(
    chalk.magenta(
      '请敲入下面两行命令，享受您的开发之旅' +
        chalk.magenta.bold('(npm i可改成yarn)')
    )
  );
  console.log();
  console.log(`  cd ${path.relative(cwd, appPath)} && npm i `);
  console.log();
}
function writePackageJson({ isWenaox, appPath, appName }) {
  const packagesDir = path.join(appPath, 'package.json');
  const json = JSON.parse(fs.readFileSync(packagesDir, 'utf8'));
  json.name = appName;
  if (isWenaox) {
    json.dependencies = {
      ...json.dependencies,
      wenaox: '',
    };
  }
  fs.writeFileSync(packagesDir, JSON.stringify(json, null, 2), 'utf8');
}

async function init(appName) {
  const appPath = checkAppName(appName);
  const { appTplName } = await askTemplate();
  const { isWenaox } = await askWenaox();
  copyTemplate({ appPath, appTplName, isWenaox });
}

module.exports = init;
