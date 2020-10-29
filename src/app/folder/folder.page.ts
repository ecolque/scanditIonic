import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ScannerService } from '../providers/scanner.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements ScannerDelegate {
  private barcodes: Barcode[] = [];
  public continuousMode: boolean = false;
  public showSingleButton: boolean = true;
  public showSingleDoneButton: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,  
    public scanner: ScannerService) { }

  public startScanning() {
    this.showScanner();
    this.showSingleButton = false;
    this.showSingleDoneButton = false;
    this.scanner.delegate = this;
    this.scanner.start();
  }

  public startContinuousScanning() {
    this.continuousMode = true;
    document.getElementById('scanner').style.bottom = "10%";
    this.startScanning();
  }
  
  public resumeScanning() {
    this.scanner.resume();
    this.showScanner();
    this.showSingleButton = false;
    this.showSingleDoneButton = false;
  }

  public doneSingle() {
    this.hideScanner();
    this.scanner.pause();
    this.barcodes = [];
    document.getElementById('result').innerHTML = "";
    this.showSingleButton = true;
    this.showSingleDoneButton = false;
  }

  public done() {
    this.barcodes = [];
    document.getElementById('result').style.display = "none";
    document.getElementById('result').innerHTML = "";
    this.showSingleButton = true;
    this.showSingleDoneButton = false;
    this.continuousMode = false;
  }

  public didScan(barcodeCapture: BarcodeCapture, session: BarcodeCaptureSession) {
    this.barcodes = session.newlyRecognizedBarcodes;
    this.hideScanner();
    document.getElementById('result').style.display = "block";
    this.scanner.pause();
    this.showSingleDoneButton = true;
    let scannedBarcode = "Scanned Code:<br><br>" + this.barcodes[0].symbology.toUpperCase() + ": " + this.barcodes[0].data;
    document.getElementById('result').innerHTML = scannedBarcode;
  }

  public ionViewDidEnter(): void {
  }

  public showScanner() {
    document.getElementById('scanner').style.display = "block";
    document.getElementById('result').style.display = "none";
    document.getElementById('result').innerHTML = "";
  }

  public hideScanner() {
    document.getElementById('scanner').style.display = "none";
  }
}
