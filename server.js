const express = require('express');
const fs = require('fs-extra');
const { exec } = require('child_process');
const path = require('path');
const app = express();
const port = 3001;

app.use(express.static('dist'));

app.post('/run-json', async (req, res) => {
  try {
    // Define the paths to the schema and ui schema files

    // Replace with the name of the downloaded file
    const filename = 'schema.json';

    // Get the path of the Downloads folder
    const downloadsPath = path.join(require('os').homedir(), 'Downloads');

    // Check if the file exists in the Downloads folder
    if (fs.existsSync(path.join(downloadsPath, filename))) {
      // Read the content of the file
      const content = fs.readFileSync(
        path.join(downloadsPath, filename),
        'utf8'
      );
      // Save the content to a file named 'schema.json'
      const schemaPath = 'src/schema.json';
      fs.writeFileSync(schemaPath, content);

      console.log(`Content saved to schema.json`);
    } else {
      console.log(`File '${filename}' not found in the Downloads folder`);
    }

    const uiSchemaPath = 'src/uischema.json';

    // Load the contents of the schema and ui schema files into JSON objects
    const schema = JSON.parse(
      fs.readFileSync(path.join(downloadsPath, filename), 'utf8')
    );
    const uiSchema = JSON.parse(fs.readFileSync(uiSchemaPath, 'utf8'));
    // const schemaPath = 'src/schema.json';
    // const uiSchemaPath = 'src/uischema.json';

    // Read the schema and ui schema files
    // const schema = await fs.readJson(schemaPath);
    //  const uiSchema = await fs.readJson(uiSchemaPath);

    // Convert the JSON objects into strings
    const schemaStr = JSON.stringify(schema);
    const uiSchemaStr = JSON.stringify(uiSchema);

    // Define the command to run the React JSON app
    const command = 'npm start';

    // Set environment variables for the app
    const env = {
      ...process.env,
      SCHEMA: schemaStr,
      UI_SCHEMA: uiSchemaStr,
    };

    // Execute the command to start the React JSON app
    const child = exec(command, { env });
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);

    res.status(200).send('Running React JSON app...');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error running React JSON app');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
