import Docker from 'dockerode';

const docker = new Docker();

export const listContainer = async () => {
   
    const containers = await docker.listContainers();
    console.log('Containers', containers);
    //Print Ports array from container
    containers.forEach((containerInfo) => {
        console.log(containerInfo.Ports);
    })
}

export const handleContainerCreate = async (projectId, terminalSocket, req, tcpSocket, head) => {
    console.log('Project ID received for container creation:', projectId);

    try {
        const container = await docker.createContainer({
            Image: 'sandbox',
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Cmd: ['/bin/bash'],
            Tty: true,
            User: 'sandbox',
            Volumes: {
                '/home/sandbox/app': {}
            },
            ExposedPorts: {
                '5173/tcp': {}
            },
            Env: ['HOST=0.0.0.0'],
            HostConfig: {
                Binds: [ //mounting the project directory to the container
                    `${process.cwd()}/projects/${projectId}:/home/sandbox/app`
                ],
                PortBindings: {
                    '5173/tcp': [
                        {
                            HostPort: '0' //random port will be assigned by docker
                        }
                    ]
                },
            }
        });

        console.log('Container created', container.id);

        await container.start()

        console.log('Container started');

        // Below is the place where we upgrade the connection to websocket
        terminalSocket.handleUpgrade(req, tcpSocket, head, (establishedWSConn) => {
            console.log("Connection upgraded to websocket");
            terminalSocket.emit("connection", establishedWSConn, req, container);
        });
       
        
    } catch (error) {
        console.log('Error while creating container', error);
           
    }
    
}
