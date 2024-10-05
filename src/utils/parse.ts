import raw from '../assets/updated_beacon_output.txt?raw';

export function parseMessage(message: string): [string | null, number[] | null, number[] | null, number[] | null]  {
    let cleanMessage: string | null = message.split("Message")[1]?.trim() || null;
    if (cleanMessage === null){
        return [null, null, null, null];
    }
    const messageId: string | null = cleanMessage.split("V")[0] || null;
    const location: number[] | null = cleanMessage.split("L")[1]?.split("]")[0]?.slice(1).split(",").map(Number) || null;
    const rotation: number[] | null = cleanMessage.split("R")[1]?.split("]")[0]?.slice(1).split(",").map(Number) || null;
    const gryoAccel: number[] | null = cleanMessage.split("G")[1]?.split("]")[0]?.slice(1).split(",").map(Number) || null;    
    return [messageId, location, rotation, gryoAccel];
}

export async function parseRawMessages (rawText: string) : Promise<string[]> {
    const messages: string[] = rawText.split("Message").slice(1).map((message) => ("Message" + message));
    return messages;
}

async function main(){
    let rawText = raw;
    const fakeMessageStream: string[] = await parseRawMessages(rawText);

    for (let i = 0; i < fakeMessageStream.length; i++) {
        console.log(parseMessage(fakeMessageStream[i]));
    }
}

main();

