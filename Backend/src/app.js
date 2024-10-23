import {Server} from './presentation/index'


(() => {
    main();
})()

async function main() {
    new Server({}).start();
}