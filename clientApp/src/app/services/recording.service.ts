import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export default class RecordingService {
    audioDataObserver: Subject<string>
    stream: MediaStream
    recorder: MediaRecorder
    chunks :BlobEvent["data"][] = []
    status = "Idle"

    constructor() {
        this.init()
    }

    private async init() {
        this.audioDataObserver = new Subject()
        try {
            this.stream = await navigator.mediaDevices.getUserMedia({audio: true})
            this.recorder = new MediaRecorder(this.stream)
            this.recorder.ondataavailable = this.handleDataAvailable.bind(this)
            this.recorder.onstop = this.handleStop.bind(this)
        } catch (error) {
            console.log('ERROR INITIALIZING MEDIA DEViCES', error)
        }

    }

    record() {
        if(this.stream && this.recorder) {
            this.recorder.start()
            this.status = 'Recording'
        } else {
            console.log('Cant start recording: ', this.stream, this.recorder)
        }
    }

    stop() {
        this.recorder.stop()
        this.status = 'Stopped'
    }

    handleDataAvailable(ev: BlobEvent) {
        if(ev.data.size > 0) {
            this.chunks.push(ev.data)
        }
    }

    handleStop(ev) {
        const blob = new Blob(this.chunks, {type: 'audio/ogg;codecs=opus'})
        const url = window.URL.createObjectURL(blob)
        this.chunks = []
        this.audioDataObserver.next(url)
    }

}