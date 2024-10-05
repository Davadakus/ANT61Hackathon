import fs from 'node:fs/promises';

async function readTextFile(filePath: string): Promise<string> {
    try {
        const data = await fs.readFile(filePath, 'utf8'); // Use promise-based fs.readFile
        return data;
    } catch (err) {
        console.error('Error reading file:', err);
        return "";
    }
}

function parseMessage(message: string): [string | null, number[] | null, number[] | null, number[] | null]  {
    message = message.split("Message")[1].trim();
    let messageId: string | null = message.split("V")[0] || null;
    let location: number[] | null = message.split("L")[1]?.split("I")[0]?.slice(1,-1).split(",").map(Number) || null;
    let rotation: number[] | null = message.split("R")[1]?.split("A")[0]?.slice(1,-1).split(",").map(Number) || null;
    let gryoAccel: number[] | null = message.split("G")[1]?.split("I")[0]?.slice(1,-1).split(",").map(Number) || null;    
    return [messageId, location, rotation, gryoAccel];
}

async function parseRawMessages (filepath: string) : Promise<string[]> {
    let rawText: string = await readTextFile(filepath);
    let messages: string[] = rawText.split("Message").slice(1).map((message) => ("Message" + message));
    return messages;
}

async function main(){
    let filepath: string = "../assets/updated_beacon_output.txt";
    let fakeMessageStream: string[] = await parseRawMessages(filepath);

    for (let i = 0; i < fakeMessageStream.length; i++) {
        console.log(parseMessage(fakeMessageStream[i]));
    }
}

main();

