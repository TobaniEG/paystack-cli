import * as helpers from '../lib/helpers.js';
import shell from 'shelljs';

if (!shell.which('git')) {
  shell.echo('Sorry, this script requires git');
  shell.exit(1);
}

import samples from '../lib/samples.js';
const keys = Object.keys(samples);

const init = () => {
  vorpal
    .command(
      'sample <sample_name> <outputDir>',
      'Get started quickly with a Paystack sample project.  Available samples are ' +
        keys.toString(),
    )
    .validate(function (args) {
      let selected_integration = db.read('selected_integration').id;
      let user = db.read('user').id;
      if (!selected_integration || !user) {
        helpers.errorLog(
          "You're not signed in, please run the `login` command before you begin",
        );
        return false;
      }
    })
    .action(async (args, callback) => {
      if (keys.indexOf(args.sample) < 0) {
        helpers.errorLog(
          'No sample app available with the name ' + args.sample,
        );
        helpers.infoLog('Available samples are ' + keys.toString());
        callback();
        return;
      }
      let sample = samples[args.sample];

      shell.cd(args.filepath);
      shell.exec('git clone ' + sample.git);
      shell.cd(sample.name);
      shell.exec('npm install');
      shell.exec('npm start');
    });
};

export default init;
