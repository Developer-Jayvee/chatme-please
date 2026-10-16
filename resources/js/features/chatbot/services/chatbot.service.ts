function getCsrfToken() {
    const meta = document.querySelector('meta[name="csrf-token"]');
    if (meta) return meta.content;

    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}
export async function streamChat(message, onChunk, onDone) {
    const response = await fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
            'X-CSRF-TOKEN': getCsrfToken(), 
        },
        credentials:'same-origin',
        body: JSON.stringify({ message }),
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const readers = response.body.getReader();
    const decoders = new TextDecoder();

    while (true) {
        const { done, value } = await readers.read();
        if (done) { console.log('STREAM DONE'); break; }
        console.log('CHUNK:', JSON.stringify(decoders.decode(value)));
    }



    const reader  = response.body.getReader();
    
    
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Append new text; { stream: true } handles multi-byte chars split across chunks
        buffer += decoder.decode(value, { stream: true });

        // SSE messages are separated by a blank line (\n\n)
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';   // keep the incomplete last part

        for (const raw of events) {
            if (!raw.trim()) continue;

            // Parse the SSE block: lines like "event: update" and "data: Hello"
            let eventName = 'message';    // default
            const dataLines = [];

            for (const line of raw.split('\n')) {
                if (line.startsWith('event:')) {
                    eventName = line.slice(6).trim();
                } else if (line.startsWith('data:')) {
                    dataLines.push(line.slice(5).trimStart());
                }
            }

            const data = dataLines.join('\n');

            // Route based on the event name
            if (eventName === 'update') {
                if (data === '</stream>') {
                    onDone();
                    return;
                }
                onChunk(data);
            }
        }
    }
}