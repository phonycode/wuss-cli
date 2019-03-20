#! node
const program = require('commander');
const chalk = require('chalk');
const semver = require('semver');

function checkNodeVersion(version) {
  if (semver.lt(process.version, version)) {
    // eslint-disable-next-line
    console.log(
      chalk`wuss-cli only support {green.bold v8.6.0} or later (current {green.bold ${
        process.version
      }}) of Node.js`
    );
    process.exit(1);
  }
}
// checkNodeVersion('8.6.0');

program.version(require('./package.json').version).usage('<command> [options]');

program
  .command('create <app-name>')
  .description('description: 初始化项目')
  .action(appName => {
    require('./commonds/create')(appName);
  });

program.arguments('<command>').action(() => {
  console.log(chalk.yellow('无效的 wuss-cli 命令'));
  program.outputHelp();
});
program.parse(process.argv);
