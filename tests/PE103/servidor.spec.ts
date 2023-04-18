import net from 'net';
import { exec } from 'child_process';
import { expect } from 'chai';
import 'mocha';

describe('Servidor', () => {
  let server: net.Server;

  before(() => {
    server = net.createServer();
    server.on('connection', (socket) => {
      socket.on('data', (data) => {
        const { command, args } = JSON.parse(data.toString());
        exec(`${command} ${args.join(' ')}`, (error, stdout, stderr) => {
          const response = { stdout, stderr, error };
          socket.write(JSON.stringify(response));
        });
      });
    });
    server.listen(3000);
  });

  after(() => {
    server.close();
  });

  it('debería responder con la salida esperada', (done) => {
    const client = net.connect({ port: 3000 }, () => {
      client.write(JSON.stringify({ command: 'echo', args: ['hola', 'mundo'] }));
    });

    client.on('data', (data) => {
      const response = JSON.parse(data.toString());
      expect(response).to.have.property('stdout', 'hola mundo\n');
      expect(response).to.not.have.property('error');
      done();
    });
  });
});