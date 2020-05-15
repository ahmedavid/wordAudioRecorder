import { Component, ChangeDetectorRef } from '@angular/core';

import { DomSanitizer } from '@angular/platform-browser';
import RecordingService from '../services/recording.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  mediaRecorder: MediaRecorder
  status = 'Idle'
  chunks = []
  clips = []
  items = [
    1,2
  ]

  constructor(
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private recordingService: RecordingService
  ) {
    this.recordingService.audioDataObserver.subscribe(data => {
      const newClip = {
        name: 'Clip',
        url: this.getURL(data)
      }
      this.clips.push(newClip)
      this.cd.detectChanges()
      console.log('New Recording', data)
      console.log('Clips', this.clips)
    })
  }


  async recordAudio() {
    try {
      this.recordingService.record()
    } catch (error) {
      console.error("RECORDING ERROR: ",error)
    }
  }

  stopRecordAudio() {
    this.recordingService.stop()
  }

  getURL(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url)
  }
}
